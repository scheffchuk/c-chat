"use client";

import { Brain, ChevronDown, Eye, Search, Star, X } from "lucide-react";
import Image from "next/image";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal, flushSync } from "react-dom";
import { Button } from "@/components/ui/button";
import { useFavoriteModels } from "@/hooks/use-favorite-models";
import { getModelById, type Model, models } from "@/lib/ai/model-config";
import { cn } from "@/lib/utils";
import { useModelStore } from "@/stores/model-store";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

function ProviderLogo({
  providerId,
  className,
}: {
  providerId: string;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);
  let logoId = providerId;
  if (providerId === "meta") {
    logoId = "llama";
  } else if (providerId === "xai") {
    logoId = "xai";
  }

  if (hasError) {
    return (
      <div
        className={cn(
          "flex size-6 items-center justify-center rounded bg-muted font-medium text-xs",
          className
        )}
      >
        {providerId.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <Image
      alt={providerId}
      className={cn("size-6 rounded", className)}
      height={24}
      onError={() => setHasError(true)}
      src={`https://models.dev/logos/${logoId}.svg`}
      unoptimized
      width={24}
    />
  );
}

function ModelItem({
  model,
  isSelected,
  isHighlighted,
  isFavorite,
  onSelect,
  onHover,
  onToggleFavorite,
  dataIndex,
}: {
  model: Model;
  isSelected: boolean;
  isHighlighted: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onHover: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
  dataIndex: number;
}) {
  const hasVision = model.modality?.includes("image");
  const hasReasoning = model.reasoning;

  return (
    <div className="flex w-full items-center gap-2">
      <button
        aria-selected={isSelected}
        className={cn(
          "group relative flex flex-1 cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left outline-none transition-all duration-200 ease-out",
          "min-h-[44px] md:min-h-0",
          isHighlighted
            ? "bg-accent/90 shadow-sm"
            : "hover:bg-accent/50 active:bg-accent/70",
          isSelected && "bg-accent/60"
        )}
        data-index={dataIndex}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSelect();
          }
        }}
        onMouseEnter={onHover}
        role="option"
        tabIndex={0}
        type="button"
      >
        <ProviderLogo providerId={model.providerId} />

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="truncate font-medium text-sm">{model.name}</span>

          <div className="flex items-center gap-1">
            {hasReasoning && (
              <div
                className="flex size-4 items-center justify-center rounded bg-primary/10 text-primary"
                title="Supports reasoning"
              >
                <Brain className="size-3" />
              </div>
            )}
            {hasVision && (
              <div
                className="flex size-4 items-center justify-center rounded bg-primary/10 text-primary"
                title="Supports vision"
              >
                <Eye className="size-3" />
              </div>
            )}
          </div>
        </div>

        {isSelected && (
          <div className="flex size-5 items-center justify-center">
            <div className="size-2 rounded-full bg-primary" />
          </div>
        )}
      </button>

      <button
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        className={cn(
          "flex size-8 items-center justify-center rounded-lg transition-colors",
          isFavorite
            ? "text-amber-400 hover:text-amber-300"
            : "text-muted-foreground hover:text-foreground"
        )}
        onClick={onToggleFavorite}
        type="button"
      >
        <Star className={cn("size-4", isFavorite && "fill-current")} />
      </button>
    </div>
  );
}

type ModelSelectorProps = {
  value: string;
  onValueChange: (modelId: string) => void;
  className?: string;
  disabled?: boolean;
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: dense UI state handling
export function ModelSelector({
  value,
  onValueChange,
  className,
  disabled = false,
}: ModelSelectorProps) {
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    openAbove: false,
  });
  const [hasEverOpened, setHasEverOpened] = useState(false);
  const [visible, setVisible] = useState(false);

  const isMobile = useIsMobile();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const open = visible;

  const {
    favorites,
    toggleFavorite,
    isFavorite,
    addDefaults,
    missingDefaultsCount,
  } = useFavoriteModels();

  const deferredQuery = useDeferredValue(query);
  const isSearching = deferredQuery.trim().length > 0;

  const selectedModel = useMemo(() => getModelById(value), [value]);

  const uniqueProviders = useMemo(() => {
    const providerMap = new Map<
      string,
      { id: string; name: string; count: number }
    >();
    for (const model of models) {
      const existing = providerMap.get(model.providerId);
      if (existing) {
        existing.count += 1;
      } else {
        providerMap.set(model.providerId, {
          id: model.providerId,
          name: model.provider,
          count: 1,
        });
      }
    }
    return Array.from(providerMap.values()).sort((a, b) => b.count - a.count);
  }, []);

  const filteredModels = useMemo(() => {
    if (deferredQuery.trim()) {
      const q = deferredQuery.toLowerCase().replace(/[-_\s]/g, "");
      const normalize = (s: string) => s.toLowerCase().replace(/[-_\s]/g, "");
      return models.filter(
        (model) =>
          normalize(model.name).includes(q) ||
          normalize(model.provider).includes(q) ||
          normalize(model.id).includes(q)
      );
    }

    let result = models;

    if (showFavoritesOnly) {
      result = result.filter((m) => favorites.has(m.id));
    }

    if (selectedProvider) {
      result = result.filter((m) => m.providerId === selectedProvider);
    }

    return result;
  }, [deferredQuery, selectedProvider, showFavoritesOnly, favorites]);

  const flatList = useMemo(() => {
    const popularModels = filteredModels.filter((m) => m.isPopular);
    const otherModels = filteredModels.filter((m) => !m.isPopular);
    return [...popularModels, ...otherModels];
  }, [filteredModels]);

  useEffect(() => {
    const resetKey = `${deferredQuery}-${selectedProvider ?? "all"}-${showFavoritesOnly}`;
    void resetKey;
    setHighlightedIndex(0);
  }, [deferredQuery, selectedProvider, showFavoritesOnly]);

  const calculateDropdownPosition = useCallback(() => {
    if (!triggerRef.current || isMobile) {
      return;
    }
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownHeight = 480;
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;

    if (spaceAbove > spaceBelow && spaceAbove >= dropdownHeight) {
      setDropdownPosition({
        top: rect.top - dropdownHeight - 8,
        left: rect.left,
        openAbove: true,
      });
    } else {
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
        openAbove: false,
      });
    }
  }, [isMobile]);

  useLayoutEffect(() => {
    if (open) {
      calculateDropdownPosition();
    }
  }, [open, calculateDropdownPosition]);

  const handleOpen = useCallback(() => {
    if (disabled) {
      return;
    }

    calculateDropdownPosition();

    flushSync(() => {
      setHasEverOpened(true);
      setVisible(true);
    });

    setQuery("");
    setHighlightedIndex(0);
    setSelectedProvider(null);
    setShowFavoritesOnly(favorites.size > 0);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [disabled, favorites.size, calculateDropdownPosition]);

  const handleClose = useCallback(() => {
    flushSync(() => {
      setVisible(false);
    });
    triggerRef.current?.focus();
  }, []);

  const handleSelect = useCallback(
    (modelId: string) => {
      onValueChange(modelId);
      handleClose();
    },
    [onValueChange, handleClose]
  );

  const handleToggleFavorite = useCallback(
    (e: React.MouseEvent, modelId: string) => {
      e.stopPropagation();
      toggleFavorite(modelId);
    },
    [toggleFavorite]
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < flatList.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          if (flatList[highlightedIndex]) {
            handleSelect(flatList[highlightedIndex].id);
          }
          break;
        case "Escape":
          e.preventDefault();
          handleClose();
          break;
        case "Tab":
          e.preventDefault();
          handleClose();
          break;
        default:
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, flatList, highlightedIndex, handleSelect, handleClose]);

  useEffect(() => {
    if (!(listRef.current && open)) {
      return;
    }
    const selectedElement = listRef.current.querySelector(
      `[data-index="${highlightedIndex}"]`
    );
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleClickOutside(e: MouseEvent) {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, handleClose]);

  const hasFavorites = favorites.size > 0;
  let emptyStateText = "No models found";
  if (!isSearching && showFavoritesOnly) {
    emptyStateText = "No favorites yet";
  }
  const showClearSearch = isSearching;
  const showAddDefaults = !isSearching && showFavoritesOnly;

  return (
    <>
      <button
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select model"
        className={cn(
          "group flex items-center gap-1.5 md:gap-2",
          "h-10 rounded-xl px-3 md:h-9 md:px-3.5",
          "text-muted-foreground text-sm",
          "bg-muted/40 hover:bg-muted/70 hover:text-foreground",
          "border border-border/40 hover:border-border/60",
          "shadow-black/5 shadow-sm",
          "transition-all duration-200 ease-out",
          "disabled:cursor-not-allowed disabled:opacity-50",
          open && "border-border/60 bg-muted/70 text-foreground",
          className
        )}
        disabled={disabled}
        onClick={() => (open ? handleClose() : handleOpen())}
        ref={triggerRef}
        type="button"
      >
        {selectedModel ? (
          <>
            <ProviderLogo providerId={selectedModel.providerId} />
            <span className="truncate font-medium">{selectedModel.name}</span>
          </>
        ) : (
          <span>Select model</span>
        )}
        <ChevronDown
          className={cn(
            "size-4 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {hasEverOpened &&
        createPortal(
          isMobile ? (
            <>
              <button
                aria-label="Close model selector"
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
                type="button"
              />
              <div className="fixed inset-0 z-50 flex items-end">
                <div
                  className="flex max-h-[85vh] w-full flex-col rounded-t-2xl bg-background shadow-xl"
                  ref={contentRef}
                >
                  <div className="flex items-center justify-between border-border border-b p-4">
                    <h2 className="font-semibold text-lg">Select Model</h2>
                    <button
                      className="flex size-8 items-center justify-center rounded-lg hover:bg-accent"
                      onClick={handleClose}
                      type="button"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col gap-2 overflow-hidden p-4">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
                        <input
                          autoComplete="off"
                          autoCorrect="off"
                          className="min-h-[44px] w-full flex-1 rounded-xl border border-border bg-background pr-10 pl-10 text-base text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-primary"
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Search all models..."
                          ref={inputRef}
                          spellCheck={false}
                          value={query}
                        />
                        {query && (
                          <button
                            className="-translate-y-1/2 absolute top-1/2 right-2 flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors active:bg-accent active:text-foreground"
                            onClick={() => {
                              setQuery("");
                              inputRef.current?.focus();
                            }}
                            type="button"
                          >
                            <X className="size-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {!isSearching && (
                      <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        <button
                          className={cn(
                            "flex h-9 shrink-0 items-center gap-2 rounded-full px-3.5 font-medium text-sm transition-all duration-200",
                            showFavoritesOnly
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-muted/50 text-muted-foreground active:bg-accent active:text-foreground"
                          )}
                          onClick={() => {
                            if (hasFavorites) {
                              setShowFavoritesOnly(true);
                              setSelectedProvider(null);
                            } else {
                              addDefaults();
                            }
                          }}
                          type="button"
                        >
                          <Star
                            className={cn(
                              "size-4",
                              showFavoritesOnly && "fill-current"
                            )}
                          />
                          Favorites
                        </button>

                        {uniqueProviders.slice(0, 8).map((provider) => (
                          <button
                            className={cn(
                              "flex size-9 shrink-0 items-center justify-center rounded-full transition-all duration-200",
                              selectedProvider === provider.id
                                ? "bg-accent text-foreground"
                                : "bg-muted/50 text-muted-foreground active:bg-accent active:text-foreground"
                            )}
                            key={provider.id}
                            onClick={() => {
                              if (selectedProvider !== provider.id) {
                                setSelectedProvider(provider.id);
                                setShowFavoritesOnly(false);
                              }
                            }}
                            title={provider.name}
                            type="button"
                          >
                            <ProviderLogo providerId={provider.id} />
                          </button>
                        ))}
                      </div>
                    )}

                    <div
                      className="flex-1 overflow-y-auto"
                      ref={listRef}
                      role="listbox"
                    >
                      {flatList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                          <p className="text-muted-foreground text-sm">
                            {emptyStateText}
                          </p>
                          {showClearSearch && (
                            <Button
                              onClick={() => setQuery("")}
                              size="sm"
                              variant="outline"
                            >
                              Clear search
                            </Button>
                          )}
                          {showAddDefaults && (
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addDefaults();
                              }}
                              size="sm"
                              variant="outline"
                            >
                              Add suggested models
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {flatList.map((model, index) => (
                            <ModelItem
                              dataIndex={index}
                              isFavorite={isFavorite(model.id)}
                              isHighlighted={index === highlightedIndex}
                              isSelected={model.id === value}
                              key={model.id}
                              model={model}
                              onHover={() => setHighlightedIndex(index)}
                              onSelect={() => handleSelect(model.id)}
                              onToggleFavorite={(e) =>
                                handleToggleFavorite(e, model.id)
                              }
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-border border-t pt-2 text-muted-foreground text-xs">
                      {showFavoritesOnly && missingDefaultsCount > 0 ? (
                        <button
                          className="flex items-center gap-1.5 text-primary transition-colors active:text-primary/80"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addDefaults();
                          }}
                          type="button"
                        >
                          <Star className="size-3 fill-current" />
                          Add {missingDefaultsCount} suggested
                        </button>
                      ) : (
                        <span>Tap to select</span>
                      )}
                      <span>
                        {flatList.length} model
                        {flatList.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div
              className="fixed z-50 w-[400px] rounded-xl border border-border bg-background shadow-xl"
              ref={contentRef}
              style={{
                top: dropdownPosition.openAbove
                  ? undefined
                  : `${dropdownPosition.top}px`,
                bottom: dropdownPosition.openAbove
                  ? `${window.innerHeight - dropdownPosition.top}px`
                  : undefined,
                left: `${dropdownPosition.left}px`,
              }}
            >
              <div className="flex flex-col gap-2 p-3">
                {!isSearching && (
                  <div className="flex items-center gap-2">
                    <button
                      className={cn(
                        "flex size-9 items-center justify-center rounded-xl transition-all duration-200",
                        showFavoritesOnly
                          ? "bg-amber-500/20 text-amber-400 shadow-amber-500/10 shadow-sm"
                          : "text-muted-foreground hover:scale-105 hover:bg-accent hover:text-foreground"
                      )}
                      onClick={() => {
                        if (hasFavorites) {
                          setShowFavoritesOnly(true);
                          setSelectedProvider(null);
                        } else {
                          addDefaults();
                        }
                      }}
                      title={
                        hasFavorites
                          ? "Show favorites"
                          : "Add suggested favorites"
                      }
                      type="button"
                    >
                      <Star
                        className={cn(
                          "size-4",
                          showFavoritesOnly && "fill-current"
                        )}
                      />
                    </button>

                    {uniqueProviders.slice(0, 6).map((provider) => (
                      <button
                        className={cn(
                          "flex size-9 items-center justify-center rounded-xl transition-all duration-200",
                          selectedProvider === provider.id
                            ? "bg-accent text-foreground shadow-sm"
                            : "text-muted-foreground hover:scale-105 hover:bg-accent/60 hover:text-foreground"
                        )}
                        key={provider.id}
                        onClick={() => {
                          if (selectedProvider !== provider.id) {
                            setSelectedProvider(provider.id);
                            setShowFavoritesOnly(false);
                          }
                        }}
                        title={provider.name}
                        type="button"
                      >
                        <ProviderLogo providerId={provider.id} />
                      </button>
                    ))}
                  </div>
                )}

                <div className="relative">
                  <Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
                  <input
                    autoComplete="off"
                    autoCorrect="off"
                    className="w-full rounded-lg border border-border bg-background py-2 pr-8 pl-10 text-foreground text-sm outline-none placeholder:text-muted-foreground/60 focus:border-primary"
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search all models..."
                    ref={inputRef}
                    spellCheck={false}
                    value={query}
                  />
                  {query && (
                    <button
                      className="-translate-y-1/2 absolute top-1/2 right-2 flex size-6 items-center justify-center rounded-lg text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground"
                      onClick={() => {
                        setQuery("");
                        inputRef.current?.focus();
                      }}
                      title="Clear search"
                      type="button"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </div>

                <div
                  className="max-h-[360px] overflow-y-auto"
                  ref={listRef}
                  role="listbox"
                >
                  {flatList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                      <p className="text-muted-foreground text-sm">
                        {emptyStateText}
                      </p>
                      {showClearSearch && (
                        <Button
                          onClick={() => setQuery("")}
                          size="sm"
                          variant="outline"
                        >
                          Clear search
                        </Button>
                      )}
                      {showAddDefaults && (
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addDefaults();
                          }}
                          size="sm"
                          variant="outline"
                        >
                          Add suggested models
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {flatList.map((model, index) => (
                        <ModelItem
                          dataIndex={index}
                          isFavorite={isFavorite(model.id)}
                          isHighlighted={index === highlightedIndex}
                          isSelected={model.id === value}
                          key={model.id}
                          model={model}
                          onHover={() => setHighlightedIndex(index)}
                          onSelect={() => handleSelect(model.id)}
                          onToggleFavorite={(e) =>
                            handleToggleFavorite(e, model.id)
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-border border-t pt-2 text-[11px] text-muted-foreground">
                  {showFavoritesOnly && missingDefaultsCount > 0 ? (
                    <button
                      className="flex items-center gap-1 text-primary transition-colors hover:text-primary/80"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addDefaults();
                      }}
                      type="button"
                    >
                      <Star className="size-3 fill-current" />
                      Add {missingDefaultsCount} suggested
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px]">
                        ↑↓
                      </kbd>
                      <span>navigate</span>
                      <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px]">
                        ↵
                      </kbd>
                      <span>select</span>
                    </div>
                  )}
                  <span>
                    {flatList.length} model{flatList.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
          ),
          document.body
        )}
    </>
  );
}

export function ConnectedModelSelector({
  className,
  disabled,
}: {
  className?: string;
  disabled?: boolean;
}) {
  const selectedModelId = useModelStore((state) => state.selectedModelId);
  const setSelectedModel = useModelStore((state) => state.setSelectedModel);

  return (
    <ModelSelector
      className={className}
      disabled={disabled}
      onValueChange={setSelectedModel}
      value={selectedModelId}
    />
  );
}
