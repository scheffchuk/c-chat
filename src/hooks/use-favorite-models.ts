import { useMutation, useQuery } from "convex/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_FAVORITES } from "@/lib/ai/model-config";
import { api } from "../../convex/_generated/api";

export function useFavoriteModels() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const isInitialized = useRef(false);

  const serverFavorites = useQuery(api.userPreferences.getFavoriteModels);

  const toggleFavoriteMutation = useMutation(
    api.userPreferences.toggleFavoriteModel
  );
  const setFavoritesMutation = useMutation(
    api.userPreferences.setFavoriteModels
  );

  useEffect(() => {
    if (serverFavorites !== undefined && !isInitialized.current) {
      setFavorites(new Set(serverFavorites ?? []));
      isInitialized.current = true;
    }
  }, [serverFavorites]);

  const toggleFavorite = useCallback(
    (modelId: string) => {
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(modelId)) {
          next.delete(modelId);
        } else {
          next.add(modelId);
        }
        return next;
      });

      toggleFavoriteMutation({ modelId }).catch(() => {
        setFavorites((prev) => {
          const next = new Set(prev);
          if (next.has(modelId)) {
            next.delete(modelId);
          } else {
            next.add(modelId);
          }
          return next;
        });
      });
    },
    [toggleFavoriteMutation]
  );

  const isFavorite = useCallback(
    (modelId: string) => favorites.has(modelId),
    [favorites]
  );

  const addDefaults = useCallback(() => {
    const newFavorites = new Set([...favorites, ...DEFAULT_FAVORITES]);
    setFavorites(newFavorites);
    setFavoritesMutation({ modelIds: Array.from(newFavorites) }).catch(() => {
      setFavorites(favorites);
    });
  }, [favorites, setFavoritesMutation]);

  const missingDefaultsCount = DEFAULT_FAVORITES.filter(
    (id) => !favorites.has(id)
  ).length;

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    addDefaults,
    hasMissingDefaults: missingDefaultsCount > 0,
    missingDefaultsCount,
    isLoading: !isInitialized.current && serverFavorites !== undefined,
  };
}
