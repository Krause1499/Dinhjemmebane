import { router, useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import WebView, { type WebViewMessageEvent } from "react-native-webview";
import { useCart } from "../context/CartContext";
import { Colors } from "../theme";

const API = "https://dinhjemmebaneapi.runasp.net/api";

export default function PaymentScreen() {
  const { sessionId, orderHandle } = useLocalSearchParams<{
    sessionId: string;
    orderHandle: string;
    referenceId: string;
  }>();
  const { clearCart } = useCart();
  const handledRef = useRef(false);

  async function handleAccept() {
    if (handledRef.current) return;
    handledRef.current = true;

    try {
      await fetch(`${API}/payment/Verify?orderHandle=${encodeURIComponent(orderHandle)}`, {
        credentials: "include",
      });
    } catch {
      // Fortsæt selvom verify fejler
    }

    clearCart();
    router.replace("/order-success");
  }

  function handleMessage(event: WebViewMessageEvent) {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      const type = (data.event ?? "").toLowerCase();

      if (type === "accept") handleAccept();
      else if (type === "cancel" || type === "error") router.back();
    } catch {
      // Ignorer ikke-JSON beskeder
    }
  }

  // Loader Frisbii's embedded checkout via checkout.js og lytter på events
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { height: 100%; background: #0e1520; }
    #checkout { width: 100%; height: 100%; }
    #checkout iframe { width: 100% !important; height: 100vh !important; border: none; }
  </style>
</head>
<body>
  <div id="checkout"></div>
  <script src="https://checkout.reepay.com/checkout.js"></script>
  <script>
    var rp = new Reepay.EmbeddedCheckout("${sessionId}", {
      html_element: "checkout",
      showReceipt: false,
    });

    rp.addEventHandler(Reepay.Event.Accept, function(data) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ event: "accept", data: data }));
    });
    rp.addEventHandler(Reepay.Event.Cancel, function(data) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ event: "cancel", data: data }));
    });
    rp.addEventHandler(Reepay.Event.Error, function(data) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ event: "error", data: data }));
    });
  </script>
</body>
</html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ html, baseUrl: "https://checkout.reepay.com" }}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={["*"]}
        mixedContentMode="always"
        scrollEnabled
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={Colors.gold} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  webview: {
    flex: 1,
  },

  loading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.bg,
  },
});
