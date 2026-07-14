import { useEffect, useState } from "react";
import { Alert as RNAlert } from "react-native";
import { fetchCoin } from "../services/api/coinsApi";
import { createAlert } from "../services/api/alertsApi";
import { Coin } from "../models/Coin";
import { AlertType } from "../models/Alert";
import { useWatchlist } from "../context/WatchlistContext";

export function useCoinDetailViewModel(coinId: string) {
  const { isWatchlisted, addCoin, removeCoin } = useWatchlist();
  const [coin, setCoin] = useState<Coin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>("above");
  const [targetPrice, setTargetPrice] = useState("");
  const [creatingAlert, setCreatingAlert] = useState(false);

  const watchlistEntryId = isWatchlisted(coinId);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchCoin(coinId)
      .then((data) => {
        if (!cancelled) setCoin(data);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load this coin.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [coinId]);

  async function handleToggleWatchlist() {
    setAddingToWatchlist(true);
    try {
      if (watchlistEntryId) {
        await removeCoin(coinId);
      } else {
        await addCoin(coinId);
      }
    } catch (err) {
      RNAlert.alert("Error", `Couldn't ${watchlistEntryId ? "remove from" : "add to"} watchlist.`);
    } finally {
      setAddingToWatchlist(false);
    }
  }

  async function handleCreateAlert() {
    const parsedPrice = Number(targetPrice);
    if (!targetPrice || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      RNAlert.alert("Invalid price", "Enter a positive target price.");
      return;
    }
    setCreatingAlert(true);
    try {
      await createAlert(coinId, alertType, parsedPrice);
      setTargetPrice("");
      RNAlert.alert("Alert created", `You'll be notified when ${coinId} goes ${alertType} $${parsedPrice}.`);
    } catch (err) {
      RNAlert.alert("Error", "Couldn't create alert.");
    } finally {
      setCreatingAlert(false);
    }
  }

  return {
    coin,
    loading,
    error,
    watchlistEntryId,
    addingToWatchlist,
    handleToggleWatchlist,
    alertType,
    setAlertType,
    targetPrice,
    setTargetPrice,
    creatingAlert,
    handleCreateAlert,
  };
}
