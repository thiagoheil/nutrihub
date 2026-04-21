export interface FoodOption {
  id: string;
  name: string;
  emoji: string;
}

export interface MealFoodCategory {
  label: string;
  emoji: string;
  foods: FoodOption[];
}

export interface MealFoodConfig {
  key: "breakfast" | "morningSnack" | "lunch" | "afternoonSnack" | "dinner";
  name: string;
  emoji: string;
  categories: MealFoodCategory[];
}

export const MEAL_FOOD_OPTIONS: MealFoodConfig[] = [
  {
    key: "breakfast",
    name: "Café da Manhã",
    emoji: "🌅",
    categories: [
      {
        label: "PREPARAÇÕES",
        emoji: "🔍",
        foods: [
          { id: "bf_pao_ovo", name: "Pão + Ovo", emoji: "🍳" },
          { id: "bf_pao_frango", name: "Pão + Frango", emoji: "🥪" },
          { id: "bf_pao_queijo", name: "Pão + Queijo", emoji: "🧀" },
          { id: "bf_sanduiche", name: "Sanduíche Natural", emoji: "🥗" },
          { id: "bf_tapioca_frango", name: "Tapioca + Frango", emoji: "🫓" },
          { id: "bf_tapioca_queijo", name: "Tapioca + Queijo", emoji: "🧀" },
          { id: "bf_cuscuz_ovo", name: "Cuscuz + Ovo", emoji: "🍳" },
          { id: "bf_cuscuz_queijo", name: "Cuscuz + Queijo", emoji: "🌽" },
          { id: "bf_suco_omelete", name: "Suco Verde + Omelete", emoji: "🥦" },
          { id: "bf_panqueca", name: "Panqueca de Banana c/ Aveia", emoji: "🥞" },
          { id: "bf_fruta_amendoim", name: "Fruta + Pasta de Amendoim", emoji: "🥜" },
          { id: "bf_iogurte_fruta", name: "Iogurte + Fruta", emoji: "🍓" },
          { id: "bf_omelete", name: "Omelete", emoji: "🍳" },
          { id: "bf_aveia_banana", name: "Aveia + Banana", emoji: "🍌" },
          { id: "bf_vitamina", name: "Vitamina de Frutas", emoji: "🥤" },
        ],
      },
      {
        label: "FRUTAS",
        emoji: "🍎",
        foods: [
          { id: "fr_melancia", name: "Melancia", emoji: "🍉" },
          { id: "fr_mamao", name: "Mamão", emoji: "🍊" },
          { id: "fr_melao", name: "Melão", emoji: "🍈" },
          { id: "fr_morango", name: "Morango", emoji: "🍓" },
          { id: "fr_banana", name: "Banana", emoji: "🍌" },
          { id: "fr_maca", name: "Maçã", emoji: "🍎" },
          { id: "fr_laranja", name: "Laranja", emoji: "🍊" },
        ],
      },
      {
        label: "BEBIDAS",
        emoji: "☕",
        foods: [
          { id: "bev_cafe", name: "Café", emoji: "☕" },
          { id: "bev_cafe_leite", name: "Café com Leite Desnatado", emoji: "☕" },
          { id: "bev_leite", name: "Leite Desnatado", emoji: "🥛" },
          { id: "bev_suco_verde", name: "Suco Verde", emoji: "🥦" },
        ],
      },
      {
        label: "ADICIONAIS",
        emoji: "🍴",
        foods: [
          { id: "ad_pasta_amendoim", name: "Pasta de Amendoim", emoji: "🥜" },
          { id: "ad_granola", name: "Granola", emoji: "🥣" },
          { id: "ad_whey", name: "Whey Protein", emoji: "💪" },
          { id: "ad_biscoito", name: "Biscoito Lev Magic Toast", emoji: "🍪" },
          { id: "ad_iogurte_nat", name: "Iogurte Natural Desnatado", emoji: "🥛" },
          { id: "ad_iogurte_zero", name: "Iogurte Zero", emoji: "🥛" },
          { id: "ad_iogurte_prot", name: "Iogurte Proteico", emoji: "🍶" },
        ],
      },
    ],
  },
  {
    key: "morningSnack",
    name: "Lanche da Manhã",
    emoji: "🕙",
    categories: [
      {
        label: "OPÇÕES RÁPIDAS",
        emoji: "⚡",
        foods: [
          { id: "ms_barra_prot", name: "Barra de Proteína", emoji: "💪" },
          { id: "ms_mix_nuts", name: "Mix de Nuts", emoji: "🌰" },
          { id: "ms_tapioca_ovo", name: "Tapioca com Ovo", emoji: "🫓" },
          { id: "ms_pao_ovos", name: "Pão com Ovos Mexidos", emoji: "🍳" },
          { id: "ms_cuscuz_atum", name: "Cuscuz com Atum", emoji: "🌽" },
          { id: "ms_vitamina", name: "Vitamina de Proteína", emoji: "🥤" },
        ],
      },
      {
        label: "FRUTAS",
        emoji: "🍎",
        foods: [
          { id: "ms_banana", name: "Banana", emoji: "🍌" },
          { id: "ms_maca", name: "Maçã", emoji: "🍎" },
          { id: "ms_pera", name: "Pera", emoji: "🍐" },
          { id: "ms_kiwi", name: "Kiwi", emoji: "🥝" },
          { id: "ms_uva", name: "Uva", emoji: "🍇" },
          { id: "ms_mamao", name: "Mamão", emoji: "🍊" },
          { id: "ms_morango", name: "Morango", emoji: "🍓" },
        ],
      },
      {
        label: "PROTEICOS",
        emoji: "💪",
        foods: [
          { id: "ms_iogurte_grego", name: "Iogurte Grego", emoji: "🥛" },
          { id: "ms_cottage", name: "Queijo Cottage", emoji: "🧀" },
          { id: "ms_ovos_cozidos", name: "Ovos Cozidos", emoji: "🥚" },
          { id: "ms_whey", name: "Whey Protein", emoji: "💪" },
          { id: "ms_atum", name: "Atum em Lata", emoji: "🐟" },
        ],
      },
    ],
  },
  {
    key: "lunch",
    name: "Almoço",
    emoji: "☀️",
    categories: [
      {
        label: "PROTEÍNAS",
        emoji: "🍗",
        foods: [
          { id: "lu_frango_grel", name: "Frango Grelhado", emoji: "🍗" },
          { id: "lu_frango_coz", name: "Frango Cozido", emoji: "🍗" },
          { id: "lu_patinho", name: "Patinho Moído", emoji: "🥩" },
          { id: "lu_carne_magra", name: "Carne Bovina Magra", emoji: "🥩" },
          { id: "lu_peixe", name: "Peixe Grelhado", emoji: "🐟" },
          { id: "lu_salmao", name: "Salmão", emoji: "🐟" },
          { id: "lu_tilapia", name: "Tilápia", emoji: "🐟" },
          { id: "lu_atum", name: "Atum em Lata", emoji: "🐟" },
          { id: "lu_sardinha", name: "Sardinha", emoji: "🐟" },
          { id: "lu_ovos", name: "Ovos Cozidos", emoji: "🥚" },
        ],
      },
      {
        label: "CARBOIDRATOS",
        emoji: "🍚",
        foods: [
          { id: "lu_arroz_int", name: "Arroz Integral", emoji: "🍚" },
          { id: "lu_arroz_br", name: "Arroz Branco", emoji: "🍚" },
          { id: "lu_batata_doce", name: "Batata Doce", emoji: "🍠" },
          { id: "lu_macarrao", name: "Macarrão Integral", emoji: "🍝" },
          { id: "lu_mandioca", name: "Mandioca", emoji: "🌾" },
          { id: "lu_inhame", name: "Inhame", emoji: "🌾" },
          { id: "lu_quinoa", name: "Quinoa", emoji: "🌾" },
          { id: "lu_cuscuz", name: "Cuscuz", emoji: "🌽" },
        ],
      },
      {
        label: "VERDURAS",
        emoji: "🥦",
        foods: [
          { id: "lu_brocolis", name: "Brócolis", emoji: "🥦" },
          { id: "lu_cenoura", name: "Cenoura", emoji: "🥕" },
          { id: "lu_abobrinha", name: "Abobrinha", emoji: "🥒" },
          { id: "lu_salada", name: "Salada Verde", emoji: "🥗" },
          { id: "lu_tomate", name: "Tomate", emoji: "🍅" },
          { id: "lu_beterraba", name: "Beterraba", emoji: "🫐" },
          { id: "lu_couve_flor", name: "Couve-flor", emoji: "🥦" },
          { id: "lu_espinafre", name: "Espinafre", emoji: "🌿" },
          { id: "lu_chuchu", name: "Chuchu", emoji: "🥒" },
        ],
      },
      {
        label: "LEGUMINOSAS",
        emoji: "🫘",
        foods: [
          { id: "lu_feijao_car", name: "Feijão Carioca", emoji: "🫘" },
          { id: "lu_feijao_pr", name: "Feijão Preto", emoji: "🫘" },
          { id: "lu_lentilha", name: "Lentilha", emoji: "🫘" },
          { id: "lu_graocicco", name: "Grão de Bico", emoji: "🫘" },
          { id: "lu_ervilha", name: "Ervilha", emoji: "🫛" },
        ],
      },
    ],
  },
  {
    key: "afternoonSnack",
    name: "Lanche da Tarde",
    emoji: "🕓",
    categories: [
      {
        label: "OPÇÕES RÁPIDAS",
        emoji: "⚡",
        foods: [
          { id: "as_barra_prot", name: "Barra de Proteína", emoji: "💪" },
          { id: "as_mix_nuts", name: "Mix de Nuts", emoji: "🌰" },
          { id: "as_tapioca_ovo", name: "Tapioca com Ovo", emoji: "🫓" },
          { id: "as_pao_pasta", name: "Pão + Pasta de Amendoim", emoji: "🥜" },
          { id: "as_aveia_mel", name: "Aveia com Mel", emoji: "🥣" },
          { id: "as_vitamina", name: "Vitamina de Frutas", emoji: "🥤" },
        ],
      },
      {
        label: "FRUTAS",
        emoji: "🍎",
        foods: [
          { id: "as_banana", name: "Banana", emoji: "🍌" },
          { id: "as_maca", name: "Maçã", emoji: "🍎" },
          { id: "as_pera", name: "Pera", emoji: "🍐" },
          { id: "as_kiwi", name: "Kiwi", emoji: "🥝" },
          { id: "as_uva", name: "Uva", emoji: "🍇" },
          { id: "as_morango", name: "Morango", emoji: "🍓" },
        ],
      },
      {
        label: "PROTEICOS",
        emoji: "💪",
        foods: [
          { id: "as_iogurte_grego", name: "Iogurte Grego", emoji: "🥛" },
          { id: "as_cottage", name: "Queijo Cottage", emoji: "🧀" },
          { id: "as_ovos_cozidos", name: "Ovos Cozidos", emoji: "🥚" },
          { id: "as_whey", name: "Whey Protein", emoji: "💪" },
          { id: "as_atum", name: "Atum em Lata", emoji: "🐟" },
        ],
      },
    ],
  },
  {
    key: "dinner",
    name: "Jantar",
    emoji: "🌙",
    categories: [
      {
        label: "PROTEÍNAS",
        emoji: "🍗",
        foods: [
          { id: "di_frango_grel", name: "Frango Grelhado", emoji: "🍗" },
          { id: "di_peixe", name: "Peixe Grelhado", emoji: "🐟" },
          { id: "di_salmao", name: "Salmão", emoji: "🐟" },
          { id: "di_tilapia", name: "Tilápia", emoji: "🐟" },
          { id: "di_omelete", name: "Omelete", emoji: "🍳" },
          { id: "di_atum", name: "Atum", emoji: "🐟" },
          { id: "di_sardinha", name: "Sardinha", emoji: "🐟" },
          { id: "di_frango_coz", name: "Frango Cozido", emoji: "🍗" },
          { id: "di_ovos_mexidos", name: "Ovos Mexidos", emoji: "🥚" },
          { id: "di_tofu", name: "Tofu", emoji: "🟡" },
        ],
      },
      {
        label: "CARBOIDRATOS",
        emoji: "🍠",
        foods: [
          { id: "di_batata_doce", name: "Batata Doce", emoji: "🍠" },
          { id: "di_arroz_int", name: "Arroz Integral", emoji: "🍚" },
          { id: "di_mandioca", name: "Mandioca", emoji: "🌾" },
          { id: "di_inhame", name: "Inhame", emoji: "🌾" },
          { id: "di_macarrao", name: "Macarrão Integral", emoji: "🍝" },
        ],
      },
      {
        label: "VERDURAS",
        emoji: "🥦",
        foods: [
          { id: "di_brocolis", name: "Brócolis", emoji: "🥦" },
          { id: "di_cenoura", name: "Cenoura", emoji: "🥕" },
          { id: "di_abobrinha", name: "Abobrinha", emoji: "🥒" },
          { id: "di_salada", name: "Salada Verde", emoji: "🥗" },
          { id: "di_tomate", name: "Tomate", emoji: "🍅" },
          { id: "di_couve_flor", name: "Couve-flor", emoji: "🥦" },
          { id: "di_espinafre", name: "Espinafre", emoji: "🌿" },
          { id: "di_vagem", name: "Vagem", emoji: "🫛" },
        ],
      },
    ],
  },
];
