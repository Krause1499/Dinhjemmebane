import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from "react-native";

type Shirt = {
  id: number;
  league: string;
  team: string;
  season: string;
  quality: string;
  size: string;
  hasSleeves: boolean;
  isPrinted: boolean;
  printedName?: string | null;
  price: number;
  priceWithVAT: number;
  pictureUrl?: string | null;
  isAvailable: boolean;
  images: unknown[];
};

export default function(){

    const [shirts, setShirts] = useState<Shirt[]>([]);
    const [loading, setLoading] = useState(true);

    const getAPIdata = async () => {
        setLoading(true);
        const url="https://dinhjemmebaneapi.runasp.net/api/shirts";
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Fejl ved API-kald: ${response.status}`);
        }
        else {
            const result: Shirt[] = await response.json();
            setShirts(result);
            setLoading(false);
        }
    }

    useEffect(() => {
        getAPIdata();
    }, [])

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text>Henter trøjer...</Text>
            </View>
        );
    }

  return (
    <FlatList
      data={shirts}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.card}>
          {item.pictureUrl ? (
            <Image source={{ uri: item.pictureUrl }} style={styles.image} />
          ) : null}

          <Text style={styles.title}>
            {item.team} ({item.season})
          </Text>

          <Text>Liga: {item.league}</Text>
          <Text>Størrelse: {item.size}</Text>
          <Text>Kvalitet: {item.quality}</Text>
          <Text>Pris: {item.priceWithVAT} kr.</Text>
          <Text>Tilgængelig: {item.isAvailable ? "Ja" : "Nej"}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: "cover",
  },
});