"use client";

import React, { useState, useMemo } from "react";
import {
  Beaker,
  CupSoda,
  Milk,
  Sparkles,
  ShoppingCart,
  Coffee,
  Soup,
  Salad,
  Drumstick,
  Zap,
  Heart,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { useInView } from "react-intersection-observer";

// --- TIPE DATA UNTUK MENGHILANGKAN ERROR 'ANY' ---
interface NutritionInfo {
  calories: number;
  protein: number;
  caffeine: number;
  vitamins?: string;
}

interface Ingredient {
  id: string;
  name: string;
  price: number;
  nutrition: NutritionInfo;
}

interface DrinkIngredient extends Ingredient {
  color: string;
  layerHeight: string;
  bgColor?: string;
}

interface FoodIngredient extends Ingredient {
  visual: string;
}

interface DrinkSize extends Ingredient {
  height: string;
}

// --- DATA BAHAN (SUPER LENGKAP DENGAN TIPE DATA YANG BENAR) ---
const ingredients = {
  drinkSizes: [
    {
      id: "medium",
      name: "Sedang (350ml)",
      price: 3000,
      height: "h-64",
      nutrition: { calories: 0, protein: 0, caffeine: 0 },
    },
    {
      id: "large",
      name: "Besar (500ml)",
      price: 5000,
      height: "h-80",
      nutrition: { calories: 0, protein: 0, caffeine: 0 },
    },
  ] as DrinkSize[],
  drinkBases: [
    {
      id: "espresso",
      name: "Espresso",
      price: 15000,
      color: "#4a2c2a",
      layerHeight: "25%",
      nutrition: { calories: 5, protein: 0, caffeine: 75, vitamins: "" },
      bgColor: "bg-yellow-950/20",
    },
    {
      id: "matcha",
      name: "Matcha",
      price: 18000,
      color: "#3d9970",
      layerHeight: "25%",
      nutrition: { calories: 25, protein: 1, caffeine: 70, vitamins: "A, C" },
      bgColor: "bg-emerald-950/20",
    },
    {
      id: "chocolate",
      name: "Coklat",
      price: 17000,
      color: "#5d4037",
      layerHeight: "25%",
      nutrition: { calories: 180, protein: 2, caffeine: 10, vitamins: "" },
      bgColor: "bg-stone-900/20",
    },
  ] as DrinkIngredient[],
  liquids: [
    {
      id: "steamed_milk",
      name: "Susu Panas",
      price: 5000,
      color: "#f5f5f5",
      layerHeight: "60%",
      nutrition: { calories: 150, protein: 8, caffeine: 0, vitamins: "D, B12" },
    },
    {
      id: "oat_milk",
      name: "Susu Oat",
      price: 7000,
      color: "#fdf5e6",
      layerHeight: "60%",
      nutrition: { calories: 120, protein: 3, caffeine: 0, vitamins: "D, B2" },
    },
    {
      id: "water",
      name: "Air",
      price: 0,
      color: "#cae9ff",
      layerHeight: "60%",
      nutrition: { calories: 0, protein: 0, caffeine: 0, vitamins: "" },
    },
  ] as DrinkIngredient[],
  drinkToppings: [
    {
      id: "whipped_cream",
      name: "Whipped Cream",
      price: 6000,
      color: "#ffffff",
      layerHeight: "20%",
      nutrition: { calories: 100, protein: 1, caffeine: 0, vitamins: "" },
    },
    {
      id: "boba_pearls",
      name: "Boba Pearls",
      price: 5000,
      color: "#312c2a",
      layerHeight: "15%",
      nutrition: { calories: 110, protein: 0, caffeine: 0, vitamins: "" },
    },
  ] as DrinkIngredient[],
  foodBases: [
    {
      id: "nasi_putih",
      name: "Nasi Putih",
      price: 5000,
      visual: "🍚",
      nutrition: { calories: 205, protein: 4, caffeine: 0, vitamins: "" },
    },
  ] as FoodIngredient[],
  proteins: [
    {
      id: "ayam_geprek",
      name: "Ayam Geprek",
      price: 15000,
      visual: "🍗",
      nutrition: { calories: 260, protein: 30, caffeine: 0, vitamins: "" },
    },
    {
      id: "beef_teriyaki",
      name: "Beef Teriyaki",
      price: 18000,
      visual: "🥩",
      nutrition: { calories: 350, protein: 25, caffeine: 0, vitamins: "" },
    },
  ] as FoodIngredient[],
  veggies: [
    {
      id: "selada",
      name: "Selada Segar",
      price: 3000,
      visual: "🥬",
      nutrition: { calories: 5, protein: 0, caffeine: 0, vitamins: "A, K" },
    },
    {
      id: "tomat",
      name: "Irisan Tomat",
      price: 2000,
      visual: "🍅",
      nutrition: { calories: 10, protein: 0, caffeine: 0, vitamins: "C" },
    },
  ] as FoodIngredient[],
  sauces: [
    {
      id: "sambal_bawang",
      name: "Sambal Bawang",
      price: 2000,
      visual: "🌶️",
      nutrition: { calories: 30, protein: 0, caffeine: 0, vitamins: "" },
    },
  ] as FoodIngredient[],
};

// --- SUB-KOMPONEN ---
const IngredientCard = ({
  item,
  isSelected,
  onSelect,
}: {
  item: Ingredient;
  isSelected: boolean;
  onSelect: () => void;
}) => (
  <button
    onClick={onSelect}
    className={`relative p-3 w-full text-left rounded-lg border-2 transition-all duration-200 ${
      isSelected
        ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
    }`}
  >
    <div className="flex justify-between items-center">
      <span className="font-semibold text-sm">{item.name}</span>
      <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
        +Rp {item.price.toLocaleString()}
      </span>
    </div>
    {isSelected && (
      <CheckCircle2
        size={18}
        className="absolute top-2 right-2 text-amber-500"
      />
    )}
  </button>
);

const NutritionMeter = ({
  label,
  value,
  unit,
  icon,
}: {
  label: string;
  value: number | string;
  unit: string;
  icon: React.ReactNode;
}) => (
  <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
      {icon}
      <span>{label}</span>
    </div>
    <span className="font-bold text-gray-900 dark:text-white">
      {typeof value === "number" ? value.toLocaleString() : value} {unit}
    </span>
  </div>
);

// Update type guard functions
function isDrinkIngredient(
  item: DrinkSize | DrinkIngredient | FoodIngredient | null
): item is DrinkIngredient {
  return item !== null && "layerHeight" in item && "color" in item;
}

function isFoodIngredient(
  item: DrinkSize | DrinkIngredient | FoodIngredient | null
): item is FoodIngredient {
  return item !== null && "visual" in item;
}

// --- KOMPONEN UTAMA ---
export default function CreationStation() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
  const [mode, setMode] = useState<"drink" | "food">("drink");

  const [drinkCreation, setDrinkCreation] = useState<{
    size: DrinkSize;
    base: DrinkIngredient | null;
    liquid: DrinkIngredient | null;
    toppings: DrinkIngredient[];
  }>({
    size: ingredients.drinkSizes[0],
    base: null,
    liquid: null,
    toppings: [],
  });
  const [foodCreation, setFoodCreation] = useState<{
    base: FoodIngredient | null;
    protein: FoodIngredient | null;
    veggies: FoodIngredient[];
    sauce: FoodIngredient | null;
  }>({ base: null, protein: null, veggies: [], sauce: null });
  const [creationName, setCreationName] = useState("");

  const resetCreations = () => {
    setDrinkCreation({
      size: ingredients.drinkSizes[0],
      base: null,
      liquid: null,
      toppings: [],
    });
    setFoodCreation({ base: null, protein: null, veggies: [], sauce: null });
    setCreationName("");
  };

  const selectedItems = useMemo(() => {
    const items =
      mode === "drink"
        ? [
            drinkCreation.size,
            drinkCreation.base,
            drinkCreation.liquid,
            ...drinkCreation.toppings,
          ]
        : [
            foodCreation.base,
            foodCreation.protein,
            foodCreation.sauce,
            ...foodCreation.veggies,
          ];
    return items.filter(
      (item): item is DrinkSize | DrinkIngredient | FoodIngredient =>
        item !== null
    );
  }, [mode, drinkCreation, foodCreation]);

  const totalPrice = useMemo(() => {
    return selectedItems.reduce((total, item) => total + item.price, 0);
  }, [selectedItems]);

  const totalNutrition = useMemo(() => {
    const nutrition: {
      calories: number;
      protein: number;
      caffeine: number;
      vitamins: Set<string>;
    } = { calories: 0, protein: 0, caffeine: 0, vitamins: new Set() };
    selectedItems.forEach((item) => {
      if (item.nutrition) {
        nutrition.calories += item.nutrition.calories || 0;
        nutrition.protein += item.nutrition.protein || 0;
        nutrition.caffeine += item.nutrition.caffeine || 0;
        if (item.nutrition.vitamins) {
          item.nutrition.vitamins
            .split(", ")
            .filter(Boolean)
            .forEach((v) => nutrition.vitamins.add(v));
        }
      }
    });
    return {
      ...nutrition,
      vitamins: Array.from(nutrition.vitamins).join(", "),
    };
  }, [selectedItems]);

  const recipe = useMemo(() => {
    return (
      selectedItems.map((item) => item.name).join(" + ") ||
      "Pilih bahan untuk memulai"
    );
  }, [selectedItems]);

  const layers = useMemo(() => {
    if (mode === "drink") {
      return [
        drinkCreation.base,
        drinkCreation.liquid,
        ...drinkCreation.toppings,
      ].filter(
        (item): item is DrinkIngredient =>
          item !== null && isDrinkIngredient(item)
      );
    }
    return [
      foodCreation.base,
      foodCreation.protein,
      ...foodCreation.veggies,
      foodCreation.sauce,
    ].filter(
      (item): item is FoodIngredient => item !== null && isFoodIngredient(item)
    );
  }, [mode, drinkCreation, foodCreation]);

  return (
    <section
      ref={ref}
      id="creation-station"
      className={`py-20 sm:py-24 overflow-hidden transition-colors duration-1000 bg-gray-100 dark:bg-black`}
    >
      <div
        className={`container mx-auto px-4 transition-all duration-1000 ease-out ${
          inView ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white flex items-center justify-center gap-3">
            <Beaker className="w-8 h-8 text-amber-500" />
            Creation{" "}
            <span className="text-amber-600 dark:text-amber-500">Station</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Jadilah arsitek untuk pesananmu. Racik, beri nama, dan nikmati
            kreasimu.
          </p>
        </div>

        <div className="flex justify-center bg-gray-200 dark:bg-gray-800 p-1 rounded-full w-max mx-auto mb-12">
          <button
            onClick={() => setMode("drink")}
            className={`px-8 py-2 text-sm font-semibold rounded-full transition-colors ${
              mode === "drink"
                ? "bg-white dark:bg-gray-700 shadow"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            Minuman
          </button>
          <button
            onClick={() => setMode("food")}
            className={`px-8 py-2 text-sm font-semibold rounded-full transition-colors ${
              mode === "food"
                ? "bg-white dark:bg-gray-700 shadow"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            Makanan
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 flex flex-col items-center justify-start pt-8 lg:pt-0 space-y-8">
            {mode === "drink" ? (
              <div className="flex flex-col items-center">
                <div
                  className={`relative ${drinkCreation.size.height} w-48 border-x-4 border-b-4 border-gray-300 dark:border-gray-700 rounded-b-3xl flex flex-col-reverse overflow-hidden cup-visualizer`}
                >
                  {layers.map((layer) => (
                    <div
                      key={layer.id}
                      className="w-full transition-all duration-500 ease-out"
                      style={{
                        height: isDrinkIngredient(layer)
                          ? layer.layerHeight
                          : undefined,
                        backgroundColor: isDrinkIngredient(layer)
                          ? layer.color
                          : undefined,
                      }}
                    />
                  ))}
                </div>
                <div className="w-56 h-3 bg-gray-300 dark:bg-gray-700 rounded-b-lg"></div>
              </div>
            ) : (
              <div className="relative w-72 h-72 bg-white dark:bg-gray-800 rounded-full shadow-2xl border-4 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <div className="text-5xl flex flex-wrap gap-4 justify-center items-center p-4">
                  {layers.map((layer) => (
                    <span key={layer.id} className="animate-pop-in">
                      {isFoodIngredient(layer) ? layer.visual : ""}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="w-full max-w-md bg-white/70 dark:bg-gray-900/50 p-6 rounded-2xl shadow-lg backdrop-blur-md">
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  value={creationName}
                  onChange={(e) => setCreationName(e.target.value)}
                  placeholder="Beri Nama Kreasimu..."
                  className="text-xl font-bold p-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg w-full"
                />
                <button onClick={resetCreations} title="Reset Kreasi">
                  <RefreshCw className="text-gray-500 hover:text-amber-500 transition-colors" />
                </button>
              </div>
              <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-inner">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold truncate">
                  {recipe}
                </p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 text-right mt-2">
                  Rp {totalPrice.toLocaleString()}
                </p>
              </div>
              <button className="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-lg">
                <ShoppingCart size={20} /> Tambah ke Keranjang
              </button>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white/50 dark:bg-gray-900/30 p-6 rounded-2xl shadow-lg backdrop-blur-md h-[720px] flex flex-col">
            <div className="space-y-4 flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
              {mode === "drink" ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold mb-2 text-gray-800 dark:text-gray-200">
                      Ukuran
                    </h4>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      {ingredients.drinkSizes.map((s) => (
                        <IngredientCard
                          key={s.id}
                          item={s}
                          isSelected={drinkCreation.size.id === s.id}
                          onSelect={() =>
                            setDrinkCreation((p) => ({ ...p, size: s }))
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2 text-gray-800 dark:text-gray-200">
                      Basis
                    </h4>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      {ingredients.drinkBases.map((b) => (
                        <IngredientCard
                          key={b.id}
                          item={b}
                          isSelected={drinkCreation.base?.id === b.id}
                          onSelect={() =>
                            setDrinkCreation((p) => ({
                              ...p,
                              base: p.base?.id === b.id ? null : b,
                            }))
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2 text-gray-800 dark:text-gray-200">
                      Cairan
                    </h4>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      {ingredients.liquids.map((l) => (
                        <IngredientCard
                          key={l.id}
                          item={l}
                          isSelected={drinkCreation.liquid?.id === l.id}
                          onSelect={() =>
                            setDrinkCreation((p) => ({
                              ...p,
                              liquid: p.liquid?.id === l.id ? null : l,
                            }))
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2 text-gray-800 dark:text-gray-200">
                      Topping (Bisa lebih dari satu)
                    </h4>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      {ingredients.drinkToppings.map((t) => (
                        <IngredientCard
                          key={t.id}
                          item={t}
                          isSelected={drinkCreation.toppings.some(
                            (top) => top.id === t.id
                          )}
                          onSelect={() =>
                            setDrinkCreation((p) => ({
                              ...p,
                              toppings: p.toppings.some(
                                (top) => top.id === t.id
                              )
                                ? p.toppings.filter((top) => top.id !== t.id)
                                : [...p.toppings, t],
                            }))
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold mb-2 text-gray-800 dark:text-gray-200">
                      Basis Makanan
                    </h4>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      {ingredients.foodBases.map((b) => (
                        <IngredientCard
                          key={b.id}
                          item={b}
                          isSelected={foodCreation.base?.id === b.id}
                          onSelect={() =>
                            setFoodCreation((p) => ({
                              ...p,
                              base: p.base?.id === b.id ? null : b,
                            }))
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2 text-gray-800 dark:text-gray-200">
                      Protein
                    </h4>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      {ingredients.proteins.map((prot) => (
                        <IngredientCard
                          key={prot.id}
                          item={prot}
                          isSelected={foodCreation.protein?.id === prot.id}
                          onSelect={() =>
                            setFoodCreation((p) => ({
                              ...p,
                              protein: p.protein?.id === prot.id ? null : prot,
                            }))
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2 text-gray-800 dark:text-gray-200">
                      Sayuran (Bisa lebih dari satu)
                    </h4>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      {ingredients.veggies.map((v) => (
                        <IngredientCard
                          key={v.id}
                          item={v}
                          isSelected={foodCreation.veggies.some(
                            (veg) => veg.id === v.id
                          )}
                          onSelect={() =>
                            setFoodCreation((p) => ({
                              ...p,
                              veggies: p.veggies.some((veg) => veg.id === v.id)
                                ? p.veggies.filter((veg) => veg.id !== v.id)
                                : [...p.veggies, v],
                            }))
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2 text-gray-800 dark:text-gray-200">
                      Saus
                    </h4>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      {ingredients.sauces.map((s) => (
                        <IngredientCard
                          key={s.id}
                          item={s}
                          isSelected={foodCreation.sauce?.id === s.id}
                          onSelect={() =>
                            setFoodCreation((p) => ({
                              ...p,
                              sauce: p.sauce?.id === s.id ? null : s,
                            }))
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-300 dark:border-gray-700">
              <h3 className="font-bold text-lg mb-3 text-gray-800 dark:text-gray-200">
                Estimasi Nutrisi
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <NutritionMeter
                  label="Kalori"
                  value={totalNutrition.calories}
                  unit="kcal"
                  icon={<Heart size={16} className="text-red-500" />}
                />
                <NutritionMeter
                  label="Protein"
                  value={totalNutrition.protein}
                  unit="g"
                  icon={<Drumstick size={16} className="text-orange-500" />}
                />
                <NutritionMeter
                  label="Kafein"
                  value={totalNutrition.caffeine}
                  unit="mg"
                  icon={<Zap size={16} className="text-yellow-500" />}
                />
                <NutritionMeter
                  label="Vitamin"
                  value={totalNutrition.vitamins}
                  unit=""
                  icon={<Sparkles size={16} className="text-blue-500" />}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .cup-visualizer {
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
        }
        @keyframes pop-in {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-pop-in {
          animation: pop-in 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
