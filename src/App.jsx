import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
} from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

// --- MOCK DATA & CONFIGURATION ---
const API_KEYS = {
  GEMINI: import.meta.env.VITE_GEMINI_API_KEY,
};

// --- Language & Translations ---
const translations = {
  en: {
    // General
    language_name: "English",
    // Navbar
    nav_home: "Home",
    nav_how_it_works: "How it works",
    nav_features: "Features",
    nav_faq: "FAQ",
    nav_team: "Team",
    nav_contact: "Contact",
    nav_gemini_qa: "Agrivisor AI",
    nav_login: "Login",
    nav_register: "Register",
    // Home Page Hero
    hero_title_1: "AI-Powered Crop Yield",
    hero_title_2: "Prediction and Optimization",
    hero_subtitle:
      "Leverage real-time weather, soil data, and market prices to make smarter farming decisions.",
    hero_get_started: "Get Started",
    // Prediction Form
    form_crop_name: "Crop Name",
    form_area: "Area (Acres)",
    form_planting_date: "Planting Date",
    form_state: "State",
    form_select_state: "Select State",
    form_district: "District",
    form_select_district: "Select District",
    form_soil_type: "Soil Type",
    form_soil_ph: "Soil pH",
    form_detect_soil: "Detect Soil",
    form_soil_suggestion:
      "Suggestion based on location: pH {ph}, Texture: {texture}. Values have been auto-filled.",
    form_predict_button: "Predict Yield & Get Recommendations",
    prediction_card_title: "Start Your Prediction",
    prediction_card_desc:
      "Our AI-powered tool analyzes your farm's unique conditions—from soil type and local weather patterns to market trends—to provide tailored yield forecasts and crop recommendations. Get the insights you need to optimize your harvest and maximize profitability.",
    prediction_card_button: "Start Now",
    // Loading & Alerts
    loading_text:
      "Analyzing data, fetching live weather, and generating predictions...",
    alert_fill_fields: "Please fill all required fields.",
    alert_no_coords: "Could not find coordinates for the selected district.",
    alert_select_state_district: "Please select a State and District first.",
    alert_weather_fail:
      "Failed to fetch live weather data. Please try again later.",
    // Results Display
    results_analysis_for: "Analysis for {crop} in {district}",
    results_expected_yield: "Expected Yield",
    results_tonnes: "Tonnes",
    results_harvest_window: "Harvest Window",
    results_to: "to",
    results_weather_now: "Weather Now",
    results_soil_details: "Soil Details",
    // Cards
    card_crop_recs: "Best Crop Recommendations",
    card_crop_recs_subtitle:
      "Based on your location's climate, soil, and the selected planting season ({season}).",
    card_suitability_score: "Suitability Score (out of 6)",
    card_top_5_crops: "Top 5 Recommended Crops",
    card_no_recs:
      "Could not find suitable crop recommendations for the given conditions.",
    card_disclaimer:
      "Disclaimer: This is automated guidance based on public datasets. Consult local experts for final decisions.",
    card_financials: "Financial Projections",
    card_market_price: "Market Price (₹ per Quintal)",
    card_total_cost: "Total Cost",
    card_total_revenue: "Total Revenue",
    card_estimated_profit: "Estimated Profit",
    card_profitability_breakdown: "Profitability Breakdown",
    card_market_trends: "Market Price Trends (Last 30 Days)",
    card_price_per_quintal: "Price per Quintal (₹)",
    card_market_trends_min: "Min Price",
    card_market_trends_modal: "Modal Price",
    card_market_trends_max: "Max Price",
    card_historical_weather: "Historical Weather (Last Year)",
    card_temp_humidity: "Temp & Humidity",
    card_weekly_forecast: "7-Day Weather Forecast",
    planting_suitability_title: "Planting Suitability (Next 3 Days)",
    planting_suitable_true: "Good to Plant",
    planting_suitable_false: "Not Ideal to Plant",
    reason_temp_high: "Avg. temp too high",
    reason_temp_low: "Avg. temp too low",
    reason_humidity_high: "Avg. humidity too high",
    reason_humidity_low: "Avg. humidity too low",
    // Static Pages
    how_it_works_title: "How It Works",
    how_it_works_p1:
      "Our platform simplifies complex agricultural planning into a seamless, step-by-step process. Here’s a breakdown of the data journey from your input to your personalized yield prediction:",
    how_it_works_l1:
      "User Inputs: You provide the core details: crop, location, area, soil, and planting date.",
    how_it_works_l2:
      "Geospatial & Soil Data: We convert your district into coordinates and fetch localized soil data from global databases.",
    how_it_works_l3:
      "Weather Data Fetch: We get real-time forecasts and historical climate data for your specific location.",
    how_it_works_l4:
      "Crop Recommendation: The system analyzes your local conditions to recommend the most suitable crops.",
    how_it_works_l5:
      "AI-Powered Yield Calculation: Our model adjusts baseline yields using historical weather, soil type, and other factors to create a refined prediction.",
    how_it_works_l6:
      "Market Price Analysis: We simulate fetching price trends to help you understand potential revenue.",
    how_it_works_l7:
      "Data Visualization: All processed data is rendered into easy-to-understand charts.",
    features_title: "Platform Features",
    features_f1_title: "AI Yield Prediction",
    features_f1_text:
      "Sophisticated models that go beyond baseline averages to give a more accurate yield forecast.",
    features_f2_title: "Data-Driven Recommendations",
    features_f2_text:
      "Suggests the most suitable crops based on your location's season, soil type, and climate data.",
    features_f3_title: "Live Weather & Forecasts",
    features_f3_text:
      "Get real-time temperature and humidity readings, plus detailed forecasts.",
    features_f4_title: "Historical Climate Analysis",
    features_f4_text:
      "Understands the long-term weather patterns in your area to better inform predictions.",
    features_f5_title: "Interactive Visualizations",
    features_f5_text:
      "Analyze trends with responsive charts for historical weather, market prices, and crop suitability.",
    features_f6_title: "Gemini-Powered Q&A",
    features_f6_text:
      "Ask our integrated AI assistant for instant insights on agricultural topics.",
    features_note_title: "Please Note:",
    features_note_text:
      "This platform is a prototype. The yield predictions are based on statistical models and public data, and should be used as guidance, not a guarantee. Always consult with local agricultural experts.",
    faq_title: "Frequently Asked Questions",
    faq_q1_title: "How often is the data refreshed?",
    faq_q1_text:
      "Current weather data is fetched in real-time upon your request. Market price data is simulated daily. Historical datasets are updated periodically as new official data is released.",
    faq_q2_title: "What are the limits of the yield prediction?",
    faq_q2_text:
      "Our model uses historical weather and soil data to refine a baseline yield. It is a powerful estimation tool but does not yet account for micro-variables like seed quality, pest incidence, or specific weather events during the growing season.",
    faq_q3_title: "How are API keys handled?",
    faq_q3_text:
      "In this prototype, API keys are managed in the browser for demonstration. In a production deployment, all API keys MUST be stored as secure environment variables on a server, and calls would be routed through a backend.",
    faq_q4_title: "Where does the market price data come from?",
    faq_q4_text:
      "Currently, the market data is realistically simulated. Our system is designed to connect to backend services that would query official government sources like AGMARKNET and e-NAM for live prices.",
    team_title: "Our Team",
    team_subtitle:
      "We are a dedicated team of agronomists, engineers, and designers committed to building tools that support sustainable and profitable agriculture.",
    contact_title: "Contact Us",
    contact_subtitle:
      "Have a question, feedback, or partnership inquiry? We'd love to hear from you.",
    contact_name: "Full Name",
    contact_email: "Email Address",
    contact_message: "Message",
    contact_send: "Send Message",
    contact_alert:
      "Message sent! We will get back to you within 2-3 business days.",
    login_page_title: "Login to Your Account",
    login_email: "Email Address",
    login_password: "Password",
    login_button: "Login",
    login_forgot_password: "Forgot Password?",
    login_no_account: "Don't have an account?",
    login_signup_link: "Sign Up",
    register_page_title: "Create an Account",
    register_name: "Full Name",
    register_email: "Email Address",
    register_password: "Password",
    register_confirm_password: "Confirm Password",
    register_button: "Register",
    register_has_account: "Already have an account?",
    register_login_link: "Login",
    gemini_title: "Ask Agrivisor AI",
    gemini_subtitle: "Your AI Agricultural Assistant",
    gemini_placeholder: "Ask about crops, soil, or market prices...",
    gemini_welcome:
      "Hello! I'm Agrivisor, your AI agricultural assistant. How can I help you with your farming questions today?",
    gemini_error:
      "There was an error: {error}. Please ensure the API key is configured correctly.",
    gemini_no_response: "I'm sorry, I couldn't generate a response.",
    // New
    card_management_recs: "Crop Management",
    card_no_management_data:
      "Management recommendations for this crop are not yet available.",
    // CROP MANAGEMENT TRANSLATIONS
    management_fertilizer_title: "Nutrient Management",
    management_pest_title: "Pest & Disease Control",
    management_bajra_fert_rec_1: "Rainfed NPK Ratio: 40:20:20 kg/ha.",
    management_bajra_fert_rec_2: "Irrigated NPK Ratio: 60:30:30 kg/ha.",
    management_bajra_fert_rec_3:
      "Apply half Nitrogen and full Phosphorus & Potassium as basal dose. Apply remaining N at 30 days after sowing.",
    management_bajra_fert_rec_4:
      "In zinc-deficient soils, apply 10 kg/ha Zinc Sulphate at sowing.",
    management_bajra_pest_1_name: "Shoot Fly",
    management_bajra_pest_1_control:
      "Seed treatment with Imidacloprid 70 WS. Timely sowing helps escape infestation.",
    management_bajra_pest_2_name: "Stem Borer",
    management_bajra_pest_2_control:
      "Spray with Carbaryl 50 WP or Dimethoate 30 EC.",
    management_bajra_pest_3_name: "Downy Mildew",
    management_bajra_pest_3_control:
      "Use resistant varieties. Seed treatment with Metalaxyl. Spray Metalaxyl + Mancozeb.",
    management_banana_fert_rec_1:
      "High nutrient requirement: 200-300g N, 60-90g P, 300-400g K per plant per year.",
    management_banana_fert_rec_2:
      "Apply nutrients in 5-6 split doses through fertigation for best results.",
    management_banana_fert_rec_3:
      "Apply 10-15 kg of Farm Yard Manure (FYM) per plant at planting.",
    management_banana_fert_rec_4:
      "Micronutrient sprays (Zinc, Boron) are beneficial for fruit development.",
    management_banana_pest_1_name: "Rhizome Weevil",
    management_banana_pest_1_control:
      "Use healthy, pest-free suckers. Apply Carbofuran 3G granules around the plant base.",
    management_banana_pest_2_name: "Pseudostem Borer",
    management_banana_pest_2_control:
      "Keep plantation clean. Inject Monocrotophos 36 SL into the stem.",
    management_banana_pest_3_name: "Panama Wilt",
    management_banana_pest_3_control:
      "Use resistant varieties (e.g., G-9). Improve soil drainage. Drench soil with Carbendazim.",
    management_barley_fert_rec_1: "Irrigated NPK Ratio: 60:30:20 kg/ha.",
    management_barley_fert_rec_2: "Rainfed NPK Ratio: 40:20:10 kg/ha.",
    management_barley_fert_rec_3:
      "Apply half N + full P & K at sowing. Top dress remaining N at first irrigation.",
    management_barley_fert_rec_4:
      "In sulphur-deficient soils, apply 20 kg/ha Sulphur.",
    management_barley_pest_1_name: "Aphids",
    management_barley_pest_1_control:
      "Spray with Dimethoate 30 EC or Imidacloprid 17.8 SL if infestation is high.",
    management_barley_pest_2_name: "Yellow Rust",
    management_barley_pest_2_control:
      "Grow resistant varieties. Spray with Propiconazole or Tebuconazole.",
    management_barley_pest_3_name: "Loose Smut",
    management_barley_pest_3_control:
      "Treat seeds with Vitavax or Carboxin before sowing.",
    management_chilli_fert_rec_1: "General NPK Ratio: 120:60:80 kg/ha.",
    management_chilli_fert_rec_2:
      "Apply FYM at 25 t/ha. Apply half N + full P & K as basal. Top dress remaining N in 2 splits.",
    management_chilli_fert_rec_3:
      "Foliar spray of water-soluble fertilizers at flowering and fruit setting stages improves yield.",
    management_chilli_pest_1_name: "Thrips & Mites",
    management_chilli_pest_1_control:
      "Spray with Fipronil 5 SC or Spiromesifen 22.9 SC. Yellow sticky traps for monitoring.",
    management_chilli_pest_2_name: "Fruit Borer",
    management_chilli_pest_2_control:
      "Spray Emamectin Benzoate 5 SG or Chlorantraniliprole 18.5 SC.",
    management_chilli_pest_3_name: "Anthracnose & Powdery Mildew",
    management_chilli_pest_3_control:
      "Spray with Mancozeb for Anthracnose and Wettable Sulphur for Powdery Mildew.",
    management_coconut_fert_rec_1:
      "Apply 500g N, 320g P2O5, 1200g K2O per palm per year in two equal splits (pre and post monsoon).",
    management_coconut_fert_rec_2:
      "Apply 25-50 kg of organic manure (FYM or compost) per palm per year.",
    management_coconut_fert_rec_3:
      "Apply fertilizers in a circular basin of 1.8m radius around the palm.",
    management_coconut_fert_rec_4:
      "Common salt (1 kg/palm) can improve nut size and yield.",
    management_coconut_pest_1_name: "Rhinoceros Beetle",
    management_coconut_pest_1_control:
      "Crown cleaning. Use pheromone traps. Place sand mixed with naphthalene balls in leaf axils.",
    management_coconut_pest_2_name: "Red Palm Weevil",
    management_coconut_pest_2_control:
      "Avoid injuries to the palm. Stem injection with Imidacloprid.",
    management_coconut_pest_3_name: "Bud Rot",
    management_coconut_pest_3_control:
      "Cut and remove affected tissues. Drench crown with 1% Bordeaux mixture.",
    management_cotton_fert_rec_1: "Irrigated NPK Ratio: 100:50:50 kg/ha.",
    management_cotton_fert_rec_2: "Rainfed NPK Ratio: 80:40:40 kg/ha.",
    management_cotton_fert_rec_3:
      "Apply Nitrogen in 2-3 splits; full Phosphorus & Potassium as basal dose.",
    management_cotton_fert_rec_4:
      "Foliar spray of 2% DAP at flowering boosts boll development.",
    management_cotton_fert_rec_5:
      "Use biofertilizers (Azotobacter, PSB) to improve nutrient uptake.",
    management_cotton_pest_1_name: "Bollworms (Pink, American)",
    management_cotton_pest_1_control:
      "Use pheromone traps (4-5/acre) for monitoring. Spray with Emamectin Benzoate 5 SG or Chlorantraniliprole 18.5 SC if infestation crosses ETL.",
    management_cotton_pest_2_name:
      "Sucking Pests (Aphids, Jassids, Whiteflies)",
    management_cotton_pest_2_control:
      "Spray systemic insecticides like Imidacloprid 17.8 SL or Acetamiprid 20 SP. Neem oil (1500 ppm) is an effective organic alternative.",
    management_ginger_fert_rec_1: "Basal dose of 25-30 t/ha FYM.",
    management_ginger_fert_rec_2: "NPK Ratio: 75:50:50 kg/ha.",
    management_ginger_fert_rec_3:
      "Apply full P and half K at planting. Apply N and remaining K in two splits at 45 and 90 days after planting.",
    management_ginger_fert_rec_4:
      "Mulching after planting is essential to conserve moisture and control weeds.",
    management_ginger_pest_1_name: "Shoot Borer",
    management_ginger_pest_1_control:
      "Spray with Dimethoate 30 EC or Quinalphos 25 EC.",
    management_ginger_pest_2_name: "Soft Rot",
    management_ginger_pest_2_control:
      "Ensure good drainage. Treat seed rhizomes with Mancozeb solution. Drench soil with Metalaxyl.",
    management_gram_fert_rec_1:
      "NPK Ratio: 20:60:20 kg/ha. Apply all as basal dose.",
    management_gram_fert_rec_2:
      "Treat seeds with Rhizobium culture before sowing to enhance nitrogen fixation.",
    management_gram_fert_rec_3:
      "Application of 20 kg/ha Sulphur is beneficial, especially in oilseed growing areas.",
    management_gram_pest_1_name: "Pod Borer (Helicoverpa)",
    management_gram_pest_1_control:
      "Install pheromone traps. First spray with Neem Seed Kernel Extract (NSKE) 5%. If needed, spray with Emamectin Benzoate 5 SG.",
    management_gram_pest_2_name: "Fusarium Wilt",
    management_gram_pest_2_control:
      "Use resistant varieties. Seed treatment with Trichoderma viride. Deep summer ploughing.",
    management_grapes_fert_rec_1:
      "Fertilizer schedule depends on growth stage (after pruning, flowering, fruit set).",
    management_grapes_fert_rec_2:
      "Mature vines (after 4 years) may need 500:500:1000g of NPK per vine per year in split doses.",
    management_grapes_fert_rec_3: "Apply 20-30 kg of FYM per vine per year.",
    management_grapes_fert_rec_4:
      "Use fertigation for efficient nutrient delivery.",
    management_grapes_pest_1_name: "Mealybugs",
    management_grapes_pest_1_control:
      "Spray with Buprofezin 25 SC or Imidacloprid 17.8 SL.",
    management_grapes_pest_2_name: "Downy & Powdery Mildew",
    management_grapes_pest_2_control:
      "Prophylactic sprays are crucial. Use Mancozeb for Downy Mildew and Sulphur/Hexaconazole for Powdery Mildew.",
    management_groundnut_fert_rec_1: "Rainfed NPK Ratio: 20:40:40 kg/ha.",
    management_groundnut_fert_rec_2: "Irrigated NPK Ratio: 25:50:75 kg/ha.",
    management_groundnut_fert_rec_3:
      "Apply 250 kg/ha of Gypsum during flowering for better pod development.",
    management_groundnut_fert_rec_4:
      "Seed treatment with Rhizobium is recommended.",
    management_groundnut_pest_1_name: "Leaf Miner",
    management_groundnut_pest_1_control:
      "Spray with Dimethoate 30 EC or Quinalphos 25 EC.",
    management_groundnut_pest_2_name: "Tikka Leaf Spot",
    management_groundnut_pest_2_control:
      "Spray with Carbendazim + Mancozeb or Chlorothalonil 75 WP.",
    management_jowar_fert_rec_1: "Irrigated NPK Ratio: 80:40:40 kg/ha.",
    management_jowar_fert_rec_2: "Rainfed NPK Ratio: 40:20:20 kg/ha.",
    management_jowar_fert_rec_3:
      "Apply half N and full P & K as basal dose. Top dress remaining N at 30-35 days after sowing.",
    management_jowar_pest_1_name: "Shoot Fly",
    management_jowar_pest_1_control:
      "Seed treatment with Imidacloprid. Early sowing can reduce incidence.",
    management_jowar_pest_2_name: "Stem Borer",
    management_jowar_pest_2_control:
      "Apply Carbofuran 3G granules in whorls 20-25 days after sowing.",
    management_jute_fert_rec_1: "NPK Ratio for Olitorius jute: 40:20:20 kg/ha.",
    management_jute_fert_rec_2:
      "NPK Ratio for Capsularis jute: 60:30:30 kg/ha.",
    management_jute_fert_rec_3:
      "Apply N in two splits: half as basal, half at 3-4 weeks after sowing.",
    management_jute_fert_rec_4:
      "Apply 5-7 tonnes/ha of FYM during land preparation.",
    management_jute_pest_1_name: "Jute Semilooper",
    management_jute_pest_1_control:
      "Spray with Chlorpyrifos 20 EC or Quinalphos 25 EC.",
    management_jute_pest_2_name: "Stem Rot",
    management_jute_pest_2_control:
      "Improve drainage. Seed treatment with Carbendazim. Crop rotation.",
    management_lentil_fert_rec_1:
      "NPK Ratio: 20:40:20 kg/ha. Apply all as basal dose.",
    management_lentil_fert_rec_2: "Treat seeds with Rhizobium culture.",
    management_lentil_fert_rec_3:
      "Application of 20 kg/ha Sulphur can increase yield and protein content.",
    management_lentil_pest_1_name: "Aphids",
    management_lentil_pest_1_control:
      "Spray with Dimethoate 30 EC or Imidacloprid 17.8 SL.",
    management_lentil_pest_2_name: "Rust & Wilt",
    management_lentil_pest_2_control:
      "Use resistant varieties. Seed treatment with Thiram + Carbendazim.",
    management_maize_fert_rec_1: "Hybrid Maize NPK Ratio: 120:60:60 kg/ha.",
    management_maize_fert_rec_2:
      "Apply 1/3 N and full P & K at sowing. Apply remaining N in two splits: at knee-high stage and at tasseling.",
    management_maize_fert_rec_3:
      "Apply 25 kg/ha Zinc Sulphate in zinc-deficient soils.",
    management_maize_pest_1_name: "Fall Armyworm",
    management_maize_pest_1_control:
      "Install pheromone traps. Apply Emamectin Benzoate 5 SG in whorls.",
    management_maize_pest_2_name: "Stem Borer",
    management_maize_pest_2_control:
      "Apply Carbofuran 3G granules into the whorl.",
    management_mango_fert_rec_1:
      "Fertilizer dose varies with age. A 10-year old tree needs approx. 1kg N, 0.5kg P, 1kg K per year.",
    management_mango_fert_rec_2:
      "Apply organic manure (50-100 kg/tree) and fertilizers in two splits, after harvest and during monsoon.",
    management_mango_fert_rec_3:
      "Apply in a circular trench around the tree canopy.",
    management_mango_pest_1_name: "Mango Hopper",
    management_mango_pest_1_control:
      "Spray with Imidacloprid 17.8 SL or Thiamethoxam 25 WG during flowering.",
    management_mango_pest_2_name: "Powdery Mildew & Anthracnose",
    management_mango_pest_2_control:
      "Spray Wettable Sulphur for mildew and Carbendazim for anthracnose.",
    management_millet_fert_rec_1:
      "General NPK Ratio for minor millets: 40:20:20 kg/ha.",
    management_millet_fert_rec_2: "Apply half N and full P & K as basal dose.",
    management_millet_fert_rec_3:
      "Top dress remaining half N around 30 days after sowing.",
    management_millet_pest_1_name: "Shoot Fly & Stem Borer",
    management_millet_pest_1_control:
      "Minor millets are generally hardy. Seed treatment with Imidacloprid can help. Clean cultivation is key.",
    management_millet_pest_2_name: "Blast & Rust",
    management_millet_pest_2_control:
      "Use resistant varieties. Generally, chemical control is not economical for minor millets.",
    management_mustard_fert_rec_1: "Irrigated NPK Ratio: 80:40:40 kg/ha.",
    management_mustard_fert_rec_2:
      "Sulphur is crucial: apply 40 kg/ha of Sulphur through Gypsum or Bentonite Sulphur.",
    management_mustard_fert_rec_3:
      "Apply half N and full P, K, S at sowing. Top dress remaining N at first irrigation (30-35 DAS).",
    management_mustard_pest_1_name: "Mustard Aphid",
    management_mustard_pest_1_control:
      "First spray with Dimethoate 30 EC or Imidacloprid 17.8 SL at 10-15% infestation.",
    management_mustard_pest_2_name: "White Rust & Alternaria Blight",
    management_mustard_pest_2_control:
      "Use resistant varieties. Spray with Mancozeb or Metalaxyl.",
    management_onion_fert_rec_1:
      "General NPK Ratio: 100:50:50 kg/ha, with 50 kg/ha Sulphur.",
    management_onion_fert_rec_2: "Apply 20-25 t/ha FYM.",
    management_onion_fert_rec_3:
      "Apply half N and full P, K, S as basal. Top dress remaining N in two splits at 30 and 45 days after transplanting.",
    management_onion_pest_1_name: "Thrips",
    management_onion_pest_1_control:
      "Use blue sticky traps. Spray with Fipronil 5 SC or Profenofos 50 EC.",
    management_onion_pest_2_name: "Purple Blotch",
    management_onion_pest_2_control:
      "Spray with Mancozeb + Carbendazim or Chlorothalonil.",
    management_pigeonpea_fert_rec_1:
      "Starter NPK dose: 20:40:20 kg/ha. Apply all as basal.",
    management_pigeonpea_fert_rec_2:
      "Seed treatment with Rhizobium and PSB culture is highly recommended.",
    management_pigeonpea_fert_rec_3:
      "Sulphur application (20 kg/ha) can improve yields.",
    management_pigeonpea_pest_1_name: "Pod Borer Complex",
    management_pigeonpea_pest_1_control:
      "Monitor with pheromone traps. Spray with Indoxacarb 14.5 SC or Emamectin Benzoate 5 SG.",
    management_pigeonpea_pest_2_name: "Fusarium Wilt",
    management_pigeonpea_pest_2_control:
      "Use resistant varieties. Deep summer ploughing. Seed treatment with Trichoderma.",
    management_potato_fert_rec_1: "NPK Ratio: 120:80:100 kg/ha.",
    management_potato_fert_rec_2: "Apply 25-30 t/ha FYM.",
    management_potato_fert_rec_3:
      "Apply half N and full P & K at planting. Apply remaining N at earthing up (25-30 days after planting).",
    management_potato_pest_1_name: "Aphids",
    management_potato_pest_1_control:
      "Vector for viruses. Spray Imidacloprid 17.8 SL.",
    management_potato_pest_2_name: "Late Blight",
    management_potato_pest_2_control:
      "Critical disease. Prophylactic sprays with Mancozeb. Curative spray with Metalaxyl + Mancozeb or Cymoxanil + Mancozeb.",
    management_ragi_fert_rec_1: "NPK Ratio: 40:20:20 kg/ha.",
    management_ragi_fert_rec_2: "Apply half N and full P & K as basal dose.",
    management_ragi_fert_rec_3:
      "Top dress remaining half N around 25-30 days after sowing/transplanting.",
    management_ragi_pest_1_name: "Stem Borer",
    management_ragi_pest_1_control:
      "Clean cultivation. If severe, apply Carbofuran 3G granules.",
    management_ragi_pest_2_name: "Blast (Neck & Finger)",
    management_ragi_pest_2_control:
      "Use resistant varieties. Seed treatment with Carbendazim. Spray Tricyclazole.",
    management_rice_fert_rec_1: "Lowland NPK Ratio: 100:60:60 kg/ha.",
    management_rice_fert_rec_2: "Upland NPK Ratio: 90:60:60 kg/ha.",
    management_rice_fert_rec_3:
      "Apply Nitrogen in 3 splits: basal, tillering, and panicle initiation.",
    management_rice_fert_rec_4:
      "Incorporate 25 kg/ha of Zinc Sulphate in zinc-deficient soils.",
    management_rice_fert_rec_5:
      "Green manuring with Daincha or Sunnhemp before transplanting is highly beneficial.",
    management_rice_pest_1_name: "Yellow Stem Borer",
    management_rice_pest_1_control:
      "Install pheromone traps. After harvest, plough the field to expose pupae. Spray Cartap Hydrochloride 4G or Fipronil 0.3 GR.",
    management_rice_pest_2_name: "Brown Planthopper (BPH)",
    management_rice_pest_2_control:
      "Avoid excessive Nitrogen. Maintain alternate wetting and drying. Spray Buprofezin 25 SC or Imidacloprid 17.8 SL at the base of the plants.",
    management_rice_pest_3_name: "Blast & Sheath Blight",
    management_rice_pest_3_control:
      "Seed treatment with Tricyclazole. For control, spray Tricyclazole 75 WP or Hexaconazole 5 EC.",
    management_soybean_fert_rec_1:
      "NPK Ratio: 20:60-80:40 kg/ha. Apply all at sowing.",
    management_soybean_fert_rec_2:
      "Seed inoculation with Rhizobium japonicum and PSB is essential.",
    management_soybean_fert_rec_3:
      "Apply 20 kg/ha Sulphur for better growth and oil content.",
    management_soybean_pest_1_name: "Girdle Beetle & Stem Fly",
    management_soybean_pest_1_control:
      "Spray with Thiamethoxam + Lambda Cyhalothrin or Profenofos + Cypermethrin.",
    management_soybean_pest_2_name: "Yellow Mosaic Virus",
    management_soybean_pest_2_control:
      "Vectored by whitefly. Use resistant varieties. Control whitefly with Thiamethoxam or Imidacloprid.",
    management_sugarcane_fert_rec_1: "General NPK Ratio: 275:62.5:112.5 kg/ha.",
    management_sugarcane_fert_rec_2:
      "Apply Nitrogen in 3 splits (30, 60, 90 days after planting).",
    management_sugarcane_fert_rec_3:
      "Apply 12.5 t/ha of Farm Yard Manure (FYM) before the last ploughing.",
    management_sugarcane_fert_rec_4:
      "Use biofertilizers like Azospirillum and Phosphobacteria to enhance nutrient availability.",
    management_sugarcane_fert_rec_5:
      "Trash mulching helps conserve moisture and adds organic matter.",
    management_sugarcane_pest_1_name: "Early Shoot Borer",
    management_sugarcane_pest_1_control:
      "Trash mulching after planting. Install light traps. Apply Chlorantraniliprole 0.4 GR or Fipronil 0.3 GR in soil.",
    management_sugarcane_pest_2_name: "Termites",
    management_sugarcane_pest_2_control:
      "Treat setts with Chlorpyrifos 20 EC or Imidacloprid 70 WS solution before planting.",
    management_sugarcane_pest_3_name: "Red Rot",
    management_sugarcane_pest_3_control:
      "Use disease-free setts. Sett treatment with Carbendazim 50 WP. Remove and destroy affected clumps.",
    management_tea_fert_rec_1:
      "Nutrient application is based on the pruning cycle and expected yield.",
    management_tea_fert_rec_2:
      "A general N:K ratio is 2:1 for young tea and 1:1 for mature tea.",
    management_tea_fert_rec_3:
      "Apply fertilizers in 4-6 split doses per year to avoid wastage.",
    management_tea_fert_rec_4:
      "Foliar application of Zinc, Magnesium, and Boron is a common practice.",
    management_tea_pest_1_name: "Tea Mosquito Bug",
    management_tea_pest_1_control: "Spray Thiamethoxam + Lambda Cyhalothrin.",
    management_tea_pest_2_name: "Red Spider Mite",
    management_tea_pest_2_control:
      "Spray Propargite 57 EC or Fenpyroximate 5 EC.",
    management_tea_pest_3_name: "Blister Blight",
    management_tea_pest_3_control:
      "Regular plucking reduces disease. Spray Hexaconazole + Copper Oxychloride during monsoon.",
    management_tomato_fert_rec_1: "Hybrid NPK Ratio: 120:80:80 kg/ha.",
    management_tomato_fert_rec_2: "Apply 25 t/ha FYM during land preparation.",
    management_tomato_fert_rec_3:
      "Apply half N and full P & K as basal. Apply remaining N in splits at 30 and 45 days after transplanting.",
    management_tomato_fert_rec_4:
      "Calcium is important to prevent blossom-end rot. Use Calcium Nitrate for fertigation.",
    management_tomato_pest_1_name: "Fruit Borer (Helicoverpa)",
    management_tomato_pest_1_control:
      "Pheromone traps for monitoring. Spray with Emamectin Benzoate 5 SG.",
    management_tomato_pest_2_name: "Leaf Curl Virus",
    management_tomato_pest_2_control:
      "Vectored by whitefly. Use resistant hybrids. Control whitefly with yellow sticky traps and sprays of Imidacloprid.",
    management_turmeric_fert_rec_1:
      "Apply 30 t/ha FYM or compost as a basal dose.",
    management_turmeric_fert_rec_2: "NPK Ratio: 60:50:120 kg/ha.",
    management_turmeric_fert_rec_3:
      "Apply full P and half K as basal. Apply N and remaining K in two splits at 45 and 90 days after planting.",
    management_turmeric_fert_rec_4:
      "Mulch the field immediately after planting with green leaves.",
    management_turmeric_pest_1_name: "Shoot Borer",
    management_turmeric_pest_1_control:
      "Spray with Malathion 50 EC or Dimethoate 30 EC.",
    management_turmeric_pest_2_name: "Rhizome Rot",
    management_turmeric_pest_2_control:
      "Ensure excellent drainage. Treat seed rhizomes and drench soil with Mancozeb or Metalaxyl.",
    management_wheat_fert_rec_1: "Irrigated NPK Ratio: 120:60:40 kg/ha.",
    management_wheat_fert_rec_2:
      "Apply 1/2 Nitrogen dose + full P & K at sowing. Apply remaining N at first irrigation.",
    management_wheat_fert_rec_3: "For late-sown wheat, increase N dose by 25%.",
    management_wheat_fert_rec_4:
      "Apply 20 kg/ha Sulphur in sulphur-deficient soils.",
    management_wheat_fert_rec_5:
      "A soil test is crucial for precise fertilizer application.",
    management_wheat_pest_1_name: "Aphids",
    management_wheat_pest_1_control:
      "Conserve natural predators like ladybird beetles. If severe, spray with Thiamethoxam 25 WG or Imidacloprid 17.8 SL.",
    management_wheat_pest_2_name: "Termites",
    management_wheat_pest_2_control:
      "Seed treatment with Fipronil 5 SC. For standing crops, apply Chlorpyrifos 20 EC with irrigation water.",
    management_wheat_pest_3_name: "Yellow Rust",
    management_wheat_pest_3_control:
      "Grow resistant varieties. Spray Propiconazole 25 EC or Tebuconazole 250 EC at the first sign of disease.",
    // New Irrigation
    card_irrigation_recs: "Irrigation Management",
    card_no_irrigation_data:
      "Irrigation recommendations for this crop are not yet available.",
    irrigation_critical_stages_title: "Critical Stages for Irrigation",
    irrigation_general_tips_title: "General Irrigation Tips",
    irrigation_wheat_cs_1:
      "Crown Root Initiation (CRI) - 20-25 days after sowing (DAS).",
    irrigation_wheat_cs_2: "Tillering - 40-45 DAS.",
    irrigation_wheat_cs_3: "Late Jointing - 60-65 DAS.",
    irrigation_wheat_cs_4: "Flowering - 80-85 DAS.",
    irrigation_wheat_cs_5: "Milking - 100-105 DAS.",
    irrigation_wheat_tip_1:
      "Apply light and frequent irrigations. Avoid water stress at critical stages.",
    irrigation_wheat_tip_2:
      "Sprinkler or drip irrigation is highly recommended for water saving.",
    irrigation_rice_cs_1: "Active Tillering stage.",
    irrigation_rice_cs_2: "Panicle Initiation to Flowering.",
    irrigation_rice_tip_1:
      "Maintain 2-5 cm of standing water in the field from transplanting until 15 days before harvest.",
    irrigation_rice_tip_2:
      "Practice Alternate Wetting and Drying (AWD) to save water without significant yield loss.",
    irrigation_cotton_cs_1:
      "Flowering and Boll Formation stages are most critical.",
    irrigation_cotton_tip_1:
      "Cotton is sensitive to waterlogging. Ensure proper drainage.",
    irrigation_cotton_tip_2:
      "Drip irrigation is highly effective, saving 40-50% water and increasing yield.",
    irrigation_sugarcane_cs_1:
      "Formative phase (first 120 days after planting).",
    irrigation_sugarcane_cs_2: "Grand Growth phase.",
    irrigation_sugarcane_tip_1:
      "Irrigate at 7-10 day intervals during summer and 15-20 day intervals during winter.",
    irrigation_sugarcane_tip_2:
      "Furrow irrigation is common, but drip irrigation can significantly improve water use efficiency.",
    irrigation_maize_cs_1: "Knee-high stage.",
    irrigation_maize_cs_2: "Tasseling and Silking stages.",
    irrigation_maize_cs_3: "Grain filling stage.",
    irrigation_maize_tip_1:
      "Avoid water stress during the flowering period as it can severely impact yield.",
    irrigation_maize_tip_2:
      "Check soil moisture before irrigating. The soil should not be completely dry.",
    // Options
    crop_names: {
      "Bajra (Pearl Millet)": "Bajra (Pearl Millet)",
      Banana: "Banana",
      "Barley (Jau)": "Barley (Jau)",
      Chilli: "Chilli",
      Coconut: "Coconut",
      Cotton: "Cotton",
      Ginger: "Ginger",
      "Gram (Chickpea)": "Gram (Chickpea)",
      Grapes: "Grapes",
      Groundnut: "Groundnut",
      "Jowar (Sorghum)": "Jowar (Sorghum)",
      Jute: "Jute",
      "Lentil (Masur)": "Lentil (Masur)",
      Maize: "Maize",
      Mango: "Mango",
      Millet: "Millet",
      Mustard: "Mustard",
      Onion: "Onion",
      "Pigeon Pea (Arhar)": "Pigeon Pea (Arhar)",
      Potato: "Potato",
      "Ragi (Finger Millet)": "Ragi (Finger Millet)",
      Rice: "Rice",
      Soybean: "Soybean",
      Sugarcane: "Sugarcane",
      Tea: "Tea",
      Tomato: "Tomato",
      Turmeric: "Turmeric",
      Wheat: "Wheat",
    },
    soil_types: {
      Alluvial: "Alluvial",
      Black: "Black",
      "Red and Yellow": "Red and Yellow",
      Laterite: "Laterite",
      Arid: "Arid",
      Forest: "Forest",
      Loamy: "Loamy",
      Clayey: "Clayey",
      Sandy: "Sandy",
      Silty: "Silty",
      Peaty: "Peaty",
    },
    states: {
      AN: "Andaman and Nicobar Islands",
      AP: "Andhra Pradesh",
      AR: "Arunachal Pradesh",
      AS: "Assam",
      BR: "Bihar",
      CH: "Chandigarh",
      CT: "Chhattisgarh",
      DN: "Dadra and Nagar Haveli and Daman and Diu",
      DL: "Delhi",
      GA: "Goa",
      GJ: "Gujarat",
      HR: "Haryana",
      HP: "Himachal Pradesh",
      JK: "Jammu and Kashmir",
      JH: "Jharkhand",
      KA: "Karnataka",
      KL: "Kerala",
      LA: "Ladakh",
      LD: "Lakshadweep",
      MP: "Madhya Pradesh",
      MH: "Maharashtra",
      MN: "Manipur",
      ML: "Meghalaya",
      MZ: "Mizoram",
      NL: "Nagaland",
      OR: "Odisha",
      PY: "Puducherry",
      PB: "Punjab",
      RJ: "Rajasthan",
      SK: "Sikkim",
      TN: "Tamil Nadu",
      TG: "Telangana",
      TR: "Tripura",
      UP: "Uttar Pradesh",
      UT: "Uttarakhand",
      WB: "West Bengal",
    },
    districts: {
      AN: {
        Nicobars: "Nicobars",
        "North and Middle Andaman": "North and Middle Andaman",
        "South Andaman": "South Andaman",
      },
      AP: {
        Anantapur: "Anantapur",
        Chittoor: "Chittoor",
        "East Godavari": "East Godavari",
        Guntur: "Guntur",
        Krishna: "Krishna",
        Kurnool: "Kurnool",
        Prakasam: "Prakasam",
        "Sri Potti Sriramulu Nellore": "Sri Potti Sriramulu Nellore",
        Srikakulam: "Srikakulam",
        Visakhapatnam: "Visakhapatnam",
        Vizianagaram: "Vizianagaram",
        "West Godavari": "West Godavari",
        "Y.S.R. Kadapa": "Y.S.R. Kadapa",
      },
      AR: {
        Anjaw: "Anjaw",
        Changlang: "Changlang",
        "Dibang Valley": "Dibang Valley",
        "East Kameng": "East Kameng",
        "East Siang": "East Siang",
        Kamle: "Kamle",
        "Kra Daadi": "Kra Daadi",
        "Kurung Kumey": "Kurung Kumey",
        "Lepa Rada": "Lepa Rada",
        Lohit: "Lohit",
        Longding: "Longding",
        "Lower Dibang Valley": "Lower Dibang Valley",
        "Lower Siang": "Lower Siang",
        "Lower Subansiri": "Lower Subansiri",
        Namsai: "Namsai",
        "Pakke Kessang": "Pakke Kessang",
        "Papum Pare": "Papum Pare",
        "Shi Yomi": "Shi Yomi",
        Siang: "Siang",
        Tawang: "Tawang",
        Tirap: "Tirap",
        "Upper Siang": "Upper Siang",
        "Upper Subansiri": "Upper Subansiri",
        "West Kameng": "West Kameng",
        "West Siang": "West Siang",
      },
      AS: {
        Baksa: "Baksa",
        Barpeta: "Barpeta",
        Biswanath: "Biswanath",
        Bongaigaon: "Bongaigaon",
        Cachar: "Cachar",
        Charaideo: "Charaideo",
        Chirang: "Chirang",
        Darrang: "Darrang",
        Dhemaji: "Dhemaji",
        Dhubri: "Dhubri",
        Dibrugarh: "Dibrugarh",
        "Dima Hasao": "Dima Hasao",
        Goalpara: "Goalpara",
        Golaghat: "Golaghat",
        Hailakandi: "Hailakandi",
        Hojai: "Hojai",
        Jorhat: "Jorhat",
        Kamrup: "Kamrup",
        "Kamrup Metropolitan": "Kamrup Metropolitan",
        "Karbi Anglong": "Karbi Anglong",
        Karimganj: "Karimganj",
        Kokrajhar: "Kokrajhar",
        Lakhimpur: "Lakhimpur",
        Majuli: "Majuli",
        Morigaon: "Morigaon",
        Nagaon: "Nagaon",
        Nalbari: "Nalbari",
        Sivasagar: "Sivasagar",
        Sonitpur: "Sonitpur",
        "South Salmara-Mankachar": "South Salmara-Mankachar",
        Tinsukia: "Tinsukia",
        Udalguri: "Udalguri",
        "West Karbi Anglong": "West Karbi Anglong",
      },
      BR: {
        Araria: "Araria",
        Arwal: "Arwal",
        Aurangabad: "Aurangabad",
        Banka: "Banka",
        Begusarai: "Begusarai",
        Bhagalpur: "Bhagalpur",
        Bhojpur: "Bhojpur",
        Buxar: "Buxar",
        Darbhanga: "Darbhanga",
        "East Champaran": "East Champaran",
        Gaya: "Gaya",
        Gopalganj: "Gopalganj",
        Jamui: "Jamui",
        Jehanabad: "Jehanabad",
        Kaimur: "Kaimur",
        Katihar: "Katihar",
        Khagaria: "Khagaria",
        Kishanganj: "Kishanganj",
        Lakhisarai: "Lakhisarai",
        Madhepura: "Madhepura",
        Madhubani: "Madhubani",
        Munger: "Munger",
        Muzaffarpur: "Muzaffarpur",
        Nalanda: "Nalanda",
        Nawada: "Nawada",
        Patna: "Patna",
        Purnia: "Purnia",
        Rohtas: "Rohtas",
        Saharsa: "Saharsa",
        Samastipur: "Samastipur",
        Saran: "Saran",
        Sheikhpura: "Sheikhpura",
        Sheohar: "Sheohar",
        Sitamarhi: "Sitamarhi",
        Siwan: "Siwan",
        Supaul: "Supaul",
        Vaishali: "Vaishali",
        "West Champaran": "West Champaran",
      },
      CH: { Chandigarh: "Chandigarh" },
      CT: {
        Balod: "Balod",
        "Baloda Bazar": "Baloda Bazar",
        Balrampur: "Balrampur",
        Bastar: "Bastar",
        Bemetara: "Bemetara",
        Bijapur: "Bijapur",
        Bilaspur: "Bilaspur",
        Dantewada: "Dantewada",
        Dhamtari: "Dhamtari",
        Durg: "Durg",
        Gariyaband: "Gariyaband",
        "Janjgir-Champa": "Janjgir-Champa",
        Jashpur: "Jashpur",
        Kabirdham: "Kabirdham",
        Kanker: "Kanker",
        Kondagaon: "Kondagaon",
        Korba: "Korba",
        Koriya: "Koriya",
        Mahasamund: "Mahasamund",
        Mungeli: "Mungeli",
        Narayanpur: "Narayanpur",
        Raigarh: "Raigarh",
        Raipur: "Raipur",
        Rajnandgaon: "Rajnandgaon",
        Sukma: "Sukma",
        Surajpur: "Surajpur",
        Surguja: "Surguja",
      },
      DN: {
        Daman: "Daman",
        Diu: "Diu",
        "Dadra and Nagar Haveli": "Dadra and Nagar Haveli",
      },
      DL: {
        "Central Delhi": "Central Delhi",
        "East Delhi": "East Delhi",
        "New Delhi": "New Delhi",
        "North Delhi": "North Delhi",
        "North East Delhi": "North East Delhi",
        "North West Delhi": "North West Delhi",
        Shahdara: "Shahdara",
        "South Delhi": "South Delhi",
        "South East Delhi": "South East Delhi",
        "South West Delhi": "South West Delhi",
        "West Delhi": "West Delhi",
      },
      GA: { "North Goa": "North Goa", "South Goa": "South Goa" },
      GJ: {
        Ahmedabad: "Ahmedabad",
        Amreli: "Amreli",
        Anand: "Anand",
        Aravalli: "Aravalli",
        Banaskantha: "Banaskantha",
        Bharuch: "Bharuch",
        Bhavnagar: "Bhavnagar",
        Botad: "Botad",
        "Chhota Udepur": "Chhota Udepur",
        Dahod: "Dahod",
        Dangs: "Dangs",
        "Devbhoomi Dwarka": "Devbhoomi Dwarka",
        Gandhinagar: "Gandhinagar",
        "Gir Somnath": "Gir Somnath",
        Jamnagar: "Jamnagar",
        Junagadh: "Junagadh",
        Kachchh: "Kachchh",
        Kheda: "Kheda",
        Mahisagar: "Mahisagar",
        Mehsana: "Mehsana",
        Morbi: "Morbi",
        Narmada: "Narmada",
        Navsari: "Navsari",
        Panchmahal: "Panchmahal",
        Patan: "Patan",
        Porbandar: "Porbandar",
        Rajkot: "Rajkot",
        Sabarkantha: "Sabarkantha",
        Surat: "Surat",
        Surendranagar: "Surendranagar",
        Tapi: "Tapi",
        Vadodara: "Vadodara",
        Valsad: "Valsad",
      },
      HR: {
        Ambala: "Ambala",
        Bhiwani: "Bhiwani",
        "Charkhi Dadri": "Charkhi Dadri",
        Faridabad: "Faridabad",
        Fatehabad: "Fatehabad",
        Gurugram: "Gurugram",
        Hisar: "Hisar",
        Jhajjar: "Jhajjar",
        Jind: "Jind",
        Kaithal: "Kaithal",
        Karnal: "Karnal",
        Kurukshetra: "Kurukshetra",
        Mahendragarh: "Mahendragarh",
        Nuh: "Nuh",
        Palwal: "Palwal",
        Panchkula: "Panchkula",
        Panipat: "Panipat",
        Rewari: "Rewari",
        Rohtak: "Rohtak",
        Sirsa: "Sirsa",
        Sonipat: "Sonipat",
        Yamunanagar: "Yamunanagar",
      },
      HP: {
        Bilaspur: "Bilaspur",
        Chamba: "Chamba",
        Hamirpur: "Hamirpur",
        Kangra: "Kangra",
        Kinnaur: "Kinnaur",
        Kullu: "Kullu",
        "Lahaul & Spiti": "Lahaul & Spiti",
        Mandi: "Mandi",
        Shimla: "Shimla",
        Sirmaur: "Sirmaur",
        Solan: "Solan",
        Una: "Una",
      },
      JK: {
        Anantnag: "Anantnag",
        Bandipore: "Bandipore",
        Baramulla: "Baramulla",
        Budgam: "Budgam",
        Doda: "Doda",
        Ganderbal: "Ganderbal",
        Jammu: "Jammu",
        Kathua: "Kathua",
        Kishtwar: "Kishtwar",
        Kulgam: "Kulgam",
        Kupwara: "Kupwara",
        Poonch: "Poonch",
        Pulwama: "Pulwama",
        Rajouri: "Rajouri",
        Ramban: "Ramban",
        Reasi: "Reasi",
        Samba: "Samba",
        Shopian: "Shopian",
        Srinagar: "Srinagar",
        Udhampur: "Udhampur",
      },
      JH: {
        Bokaro: "Bokaro",
        Chatra: "Chatra",
        Deoghar: "Deoghar",
        Dhanbad: "Dhanbad",
        Dumka: "Dumka",
        "East Singhbhum": "East Singhbhum",
        Garhwa: "Garhwa",
        Giridih: "Giridih",
        Godda: "Godda",
        Gumla: "Gumla",
        Hazaribag: "Hazaribag",
        Jamtara: "Jamtara",
        Khunti: "Khunti",
        Koderma: "Koderma",
        Latehar: "Latehar",
        Lohardaga: "Lohardaga",
        Pakur: "Pakur",
        Palamu: "Palamu",
        Ramgarh: "Ramgarh",
        Ranchi: "Ranchi",
        Sahebganj: "Sahebganj",
        "Seraikela-Kharsawan": "Seraikela-Kharsawan",
        Simdega: "Simdega",
        "West Singhbhum": "West Singhbhum",
      },
      KA: {
        Bagalkot: "Bagalkot",
        Ballari: "Ballari",
        Belagavi: "Belagavi",
        "Bengaluru Rural": "Bengaluru Rural",
        "Bengaluru Urban": "Bengaluru Urban",
        Bidar: "Bidar",
        Chamarajanagar: "Chamarajanagar",
        Chikballapur: "Chikballapur",
        Chikkamagaluru: "Chikkamagaluru",
        Chitradurga: "Chitradurga",
        "Dakshina Kannada": "Dakshina Kannada",
        Davangere: "Davangere",
        Dharwad: "Dharwad",
        Gadag: "Gadag",
        Hassan: "Hassan",
        Haveri: "Haveri",
        Kalaburagi: "Kalaburagi",
        Kodagu: "Kodagu",
        Kolar: "Kolar",
        Koppal: "Koppal",
        Mandya: "Mandya",
        Mysuru: "Mysuru",
        Raichur: "Raichur",
        Ramanagara: "Ramanagara",
        Shivamogga: "Shivamogga",
        Tumakuru: "Tumakuru",
        Udupi: "Udupi",
        "Uttara Kannada": "Uttara Kannada",
        Vijayapura: "Vijayapura",
        Yadgir: "Yadgir",
      },
      KL: {
        Alappuzha: "Alappuzha",
        Ernakulam: "Ernakulam",
        Idukki: "Idukki",
        Kannur: "Kannur",
        Kasaragod: "Kasaragod",
        Kollam: "Kollam",
        Kottayam: "Kottayam",
        Kozhikode: "Kozhikode",
        Malappuram: "Malappuram",
        Palakkad: "Palakkad",
        Pathanamthitta: "Pathanamthitta",
        Thiruvananthapuram: "Thiruvananthapuram",
        Thrissur: "Thrissur",
        Wayanad: "Wayanad",
      },
      LA: { Kargil: "Kargil", Leh: "Leh" },
      LD: { Lakshadweep: "Lakshadweep" },
      MP: {
        "Agar Malwa": "Agar Malwa",
        Alirajpur: "Alirajpur",
        Anuppur: "Anuppur",
        Ashoknagar: "Ashoknagar",
        Balaghat: "Balaghat",
        Barwani: "Barwani",
        Betul: "Betul",
        Bhind: "Bhind",
        Bhopal: "Bhopal",
        Burhanpur: "Burhanpur",
        Chhatarpur: "Chhatarpur",
        Chhindwara: "Chhindwara",
        Damoh: "Damoh",
        Datia: "Datia",
        Dewas: "Dewas",
        Dhar: "Dhar",
        Dindori: "Dindori",
        Guna: "Guna",
        Gwalior: "Gwalior",
        Harda: "Harda",
        Hoshangabad: "Hoshangabad",
        Indore: "Indore",
        Jabalpur: "Jabalpur",
        Jhabua: "Jhabua",
        Katni: "Katni",
        Khandwa: "Khandwa",
        Khargone: "Khargone",
        Mandla: "Mandla",
        Mandsaur: "Mandsaur",
        Morena: "Morena",
        Narsinghpur: "Narsinghpur",
        Neemuch: "Neemuch",
        Panna: "Panna",
        Raisen: "Raisen",
        Rajgarh: "Rajgarh",
        Ratlam: "Ratlam",
        Rewa: "Rewa",
        Sagar: "Sagar",
        Satna: "Satna",
        Sehore: "Sehore",
        Seoni: "Seoni",
        Shahdol: "Shahdol",
        Shajapur: "Shajapur",
        Sheopur: "Sheopur",
        Shivpuri: "Shivpuri",
        Sidhi: "Sidhi",
        Singrauli: "Singrauli",
        Tikamgarh: "Tikamgarh",
        Ujjain: "Ujjain",
        Umaria: "Umaria",
        Vidisha: "Vidisha",
      },
      MH: {
        Ahmednagar: "Ahmednagar",
        Akola: "Akola",
        Amravati: "Amravati",
        Aurangabad: "Aurangabad",
        Beed: "Beed",
        Bhandara: "Bhandara",
        Buldhana: "Buldhana",
        Chandrapur: "Chandrapur",
        Dhule: "Dhule",
        Gadchiroli: "Gadchiroli",
        Gondia: "Gondia",
        Hingoli: "Hingoli",
        Jalgaon: "Jalgaon",
        Jalna: "Jalna",
        Kolhapur: "Kolhapur",
        Latur: "Latur",
        "Mumbai City": "Mumbai City",
        "Mumbai Suburban": "Mumbai Suburban",
        Nagpur: "Nagpur",
        Nanded: "Nanded",
        Nandurbar: "Nandurbar",
        Nashik: "Nashik",
        Osmanabad: "Osmanabad",
        Palghar: "Palghar",
        Parbhani: "Parbhani",
        Pune: "Pune",
        Raigad: "Raigad",
        Ratnagiri: "Ratnagiri",
        Sangli: "Sangli",
        Satara: "Satara",
        Sindhudurg: "Sindhudurg",
        Solapur: "Solapur",
        Thane: "Thane",
        Wardha: "Wardha",
        Washim: "Washim",
        Yavatmal: "Yavatmal",
      },
      MN: {
        Bishnupur: "Bishnupur",
        Chandel: "Chandel",
        Churachandpur: "Churachandpur",
        "Imphal East": "Imphal East",
        "Imphal West": "Imphal West",
        Jiribam: "Jiribam",
        Kakching: "Kakching",
        Kamjong: "Kamjong",
        Kangpokpi: "Kangpokpi",
        Noney: "Noney",
        Pherzawl: "Pherzawl",
        Senapati: "Senapati",
        Tamenglong: "Tamenglong",
        Tengnoupal: "Tengnoupal",
        Thoubal: "Thoubal",
        Ukhrul: "Ukhrul",
      },
      ML: {
        "East Garo Hills": "East Garo Hills",
        "East Jaintia Hills": "East Jaintia Hills",
        "East Khasi Hills": "East Khasi Hills",
        "North Garo Hills": "North Garo Hills",
        "Ri Bhoi": "Ri Bhoi",
        "South Garo Hills": "South Garo Hills",
        "South West Garo Hills": "South West Garo Hills",
        "South West Khasi Hills": "South West Khasi Hills",
        "West Garo Hills": "West Garo Hills",
        "West Jaintia Hills": "West Jaintia Hills",
        "West Khasi Hills": "West Khasi Hills",
      },
      MZ: {
        Aizawl: "Aizawl",
        Champhai: "Champhai",
        Hnahthial: "Hnahthial",
        Khawzawl: "Khawzawl",
        Kolasib: "Kolasib",
        Lawngtlai: "Lawngtlai",
        Lunglei: "Lunglei",
        Mamit: "Mamit",
        Saiha: "Saiha",
        Saitual: "Saitual",
        Serchhip: "Serchhip",
      },
      NL: {
        Dimapur: "Dimapur",
        Kiphire: "Kiphire",
        Kohima: "Kohima",
        Longleng: "Longleng",
        Mokokchung: "Mokokchung",
        Mon: "Mon",
        Peren: "Peren",
        Phek: "Phek",
        Tuensang: "Tuensang",
        Wokha: "Wokha",
        Zunheboto: "Zunheboto",
      },
      OR: {
        Angul: "Angul",
        Balangir: "Balangir",
        Balasore: "Balasore",
        Bargarh: "Bargarh",
        Bhadrak: "Bhadrak",
        Boudh: "Boudh",
        Cuttack: "Cuttack",
        Deogarh: "Deogarh",
        Dhenkanal: "Dhenkanal",
        Gajapati: "Gajapati",
        Ganjam: "Ganjam",
        Jagatsinghpur: "Jagatsinghpur",
        Jajpur: "Jajpur",
        Jharsuguda: "Jharsuguda",
        Kalahandi: "Kalahandi",
        Kandhamal: "Kandhamal",
        Kendrapara: "Kendrapara",
        Kendujhar: "Kendujhar",
        Khordha: "Khordha",
        Koraput: "Koraput",
        Malkangiri: "Malkangiri",
        Mayurbhanj: "Mayurbhanj",
        Nabarangpur: "Nabarangpur",
        Nayagarh: "Nayagarh",
        Nuapada: "Nuapada",
        Puri: "Puri",
        Rayagada: "Rayagada",
        Sambalpur: "Sambalpur",
        Sonepur: "Sonepur",
        Sundargarh: "Sundargarh",
      },
      PY: {
        Karaikal: "Karaikal",
        Mahe: "Mahe",
        Puducherry: "Puducherry",
        Yanam: "Yanam",
      },
      PB: {
        Amritsar: "Amritsar",
        Barnala: "Barnala",
        Bathinda: "Bathinda",
        Faridkot: "Faridkot",
        "Fatehgarh Sahib": "Fatehgarh Sahib",
        Fazilka: "Fazilka",
        Firozpur: "Firozpur",
        Gurdaspur: "Gurdaspur",
        Hoshiarpur: "Hoshiarpur",
        Jalandhar: "Jalandhar",
        Kapurthala: "Kapurthala",
        Ludhiana: "Ludhiana",
        Mansa: "Mansa",
        Moga: "Moga",
        Pathankot: "Pathankot",
        Patiala: "Patiala",
        Rupnagar: "Rupnagar",
        Mohali: "Mohali",
        Sangrur: "Sangrur",
        Nawanshahr: "Nawanshahr",
        "Sri Muktsar Sahib": "Sri Muktsar Sahib",
        "Tarn Taran": "Tarn Taran",
      },
      RJ: {
        Ajmer: "Ajmer",
        Alwar: "Alwar",
        Banswara: "Banswara",
        Baran: "Baran",
        Barmer: "Barmer",
        Bharatpur: "Bharatpur",
        Bhilwara: "Bhilwara",
        Bikaner: "Bikaner",
        Bundi: "Bundi",
        Chittorgarh: "Chittorgarh",
        Churu: "Churu",
        Dausa: "Dausa",
        Dholpur: "Dholpur",
        Dungarpur: "Dungarpur",
        Hanumangarh: "Hanumangarh",
        Jaipur: "Jaipur",
        Jaisalmer: "Jaisalmer",
        Jalore: "Jalore",
        Jhalawar: "Jhalawar",
        Jhunjhunu: "Jhunjhunu",
        Jodhpur: "Jodhpur",
        Karauli: "Karauli",
        Kota: "Kota",
        Nagaur: "Nagaur",
        Pali: "Pali",
        Pratapgarh: "Pratapgarh",
        Rajsamand: "Rajsamand",
        "Sawai Madhopur": "Sawai Madhopur",
        Sikar: "Sikar",
        Sirohi: "Sirohi",
        "Sri Ganganagar": "Sri Ganganagar",
        Tonk: "Tonk",
        Udaipur: "Udaipur",
      },
      SK: {
        "East Sikkim": "East Sikkim",
        "North Sikkim": "North Sikkim",
        "South Sikkim": "South Sikkim",
        "West Sikkim": "West Sikkim",
      },
      TN: {
        Ariyalur: "Ariyalur",
        Chengalpattu: "Chengalpattu",
        Chennai: "Chennai",
        Coimbatore: "Coimbatore",
        Cuddalore: "Cuddalore",
        Dharmapuri: "Dharmapuri",
        Dindigul: "Dindigul",
        Erode: "Erode",
        Kallakurichi: "Kallakurichi",
        Kanchipuram: "Kanchipuram",
        Kanyakumari: "Kanyakumari",
        Karur: "Karur",
        Krishnagiri: "Krishnagiri",
        Madurai: "Madurai",
        Mayiladuthurai: "Mayiladuthurai",
        Nagapattinam: "Nagapattinam",
        Namakkal: "Namakkal",
        Nilgiris: "Nilgiris",
        Perambalur: "Perambalur",
        Pudukkottai: "Pudukkottai",
        Ramanathapuram: "Ramanathapuram",
        Ranipet: "Ranipet",
        Salem: "Salem",
        Sivaganga: "Sivaganga",
        Tenkasi: "Tenkasi",
        Thanjavur: "Thanjavur",
        Theni: "Theni",
        Thoothukudi: "Thoothukudi",
        Tiruchirappalli: "Tiruchirappalli",
        Tirunelveli: "Tirunelveli",
        Tirupathur: "Tirupathur",
        Tiruppur: "Tiruppur",
        Tiruvallur: "Tiruvallur",
        Tiruvannamalai: "Tiruvannamalai",
        Tiruvarur: "Tiruvarur",
        Vellore: "Vellore",
        Viluppuram: "Viluppuram",
        Virudhunagar: "Virudhunagar",
      },
      TG: {
        Adilabad: "Adilabad",
        "Bhadradri Kothagudem": "Bhadradri Kothagudem",
        Hyderabad: "Hyderabad",
        Jagtial: "Jagtial",
        Jangaon: "Jangaon",
        "Jayashankar Bhupalpally": "Jayashankar Bhupalpally",
        "Jogulamba Gadwal": "Jogulamba Gadwal",
        Kamareddy: "Kamareddy",
        Karimnagar: "Karimnagar",
        Khammam: "Khammam",
        "Komaram Bheem": "Komaram Bheem",
        Mahabubabad: "Mahabubabad",
        Mahabubnagar: "Mahabubnagar",
        Mancherial: "Mancherial",
        Medak: "Medak",
        "Medchal-Malkajgiri": "Medchal-Malkajgiri",
        Mulugu: "Mulugu",
        Nagarkurnool: "Nagarkurnool",
        Nalgonda: "Nalgonda",
        Narayanpet: "Narayanpet",
        Nirmal: "Nirmal",
        Nizamabad: "Nizamabad",
        Peddapalli: "Peddapalli",
        "Rajanna Sircilla": "Rajanna Sircilla",
        Rangareddy: "Rangareddy",
        Sangareddy: "Sangareddy",
        Siddipet: "Siddipet",
        Suryapet: "Suryapet",
        Vikarabad: "Vikarabad",
        Wanaparthy: "Wanaparthy",
        "Warangal Rural": "Warangal Rural",
        "Warangal Urban": "Warangal Urban",
        "Yadadri Bhuvanagiri": "Yadadri Bhuvanagiri",
      },
      TR: {
        Dhalai: "Dhalai",
        Gomati: "Gomati",
        Khowai: "Khowai",
        "North Tripura": "North Tripura",
        Sepahijala: "Sepahijala",
        "South Tripura": "South Tripura",
        Unakoti: "Unakoti",
        "West Tripura": "West Tripura",
      },
      UP: {
        Agra: "Agra",
        Aligarh: "Aligarh",
        Prayagraj: "Prayagraj",
        "Ambedkar Nagar": "Ambedkar Nagar",
        Amethi: "Amethi",
        Amroha: "Amroha",
        Auraiya: "Auraiya",
        Azamgarh: "Azamgarh",
        Baghpat: "Baghpat",
        Bahraich: "Bahraich",
        Ballia: "Ballia",
        Balrampur: "Balrampur",
        Banda: "Banda",
        Barabanki: "Barabanki",
        Bareilly: "Bareilly",
        Basti: "Basti",
        Bhadohi: "Bhadohi",
        Bijnor: "Bijnor",
        Budaun: "Budaun",
        Bulandshahr: "Bulandshahr",
        Chandauli: "Chandauli",
        Chitrakoot: "Chitrakoot",
        Deoria: "Deoria",
        Etah: "Etah",
        Etawah: "Etawah",
        Ayodhya: "Ayodhya",
        Farrukhabad: "Farrukhabad",
        Fatehpur: "Fatehpur",
        Firozabad: "Firozabad",
        "Gautam Buddha Nagar": "Gautam Buddha Nagar",
        Ghaziabad: "Ghaziabad",
        Ghazipur: "Ghazipur",
        Gonda: "Gonda",
        Gorakhpur: "Gorakhpur",
        Hamirpur: "Hamirpur",
        Hapur: "Hapur",
        Hardoi: "Hardoi",
        Hathras: "Hathras",
        Jalaun: "Jalaun",
        Jaunpur: "Jaunpur",
        Jhansi: "Jhansi",
        Kannauj: "Kannauj",
        "Kanpur Dehat": "Kanpur Dehat",
        "Kanpur Nagar": "Kanpur Nagar",
        Kasganj: "Kasganj",
        Kaushambi: "Kaushambi",
        Kushinagar: "Kushinagar",
        "Lakhimpur Kheri": "Lakhimpur Kheri",
        Lalitpur: "Lalitpur",
        Lucknow: "Lucknow",
        Maharajganj: "Maharajganj",
        Mahoba: "Mahoba",
        Mainpuri: "Mainpuri",
        Mathura: "Mathura",
        Mau: "Mau",
        Meerut: "Meerut",
        Mirzapur: "Mirzapur",
        Moradabad: "Moradabad",
        Muzaffarnagar: "Muzaffarnagar",
        Pilibhit: "Pilibhit",
        Pratapgarh: "Pratapgarh",
        Raebareli: "Raebareli",
        Rampur: "Rampur",
        Saharanpur: "Saharanpur",
        Sambhal: "Sambhal",
        "Sant Kabir Nagar": "Sant Kabir Nagar",
        Shahjahanpur: "Shahjahanpur",
        Shamli: "Shamli",
        Shravasti: "Shravasti",
        Siddharthnagar: "Siddharthnagar",
        Sitapur: "Sitapur",
        Sonbhadra: "Sonbhadra",
        Sultanpur: "Sultanpur",
        Unnao: "Unnao",
        Varanasi: "Varanasi",
      },
      UT: {
        Almora: "Almora",
        Bageshwar: "Bageshwar",
        Chamoli: "Chamoli",
        Champawat: "Champawat",
        Dehradun: "Dehradun",
        Haridwar: "Haridwar",
        Nainital: "Nainital",
        "Pauri Garhwal": "Pauri Garhwal",
        Pithoragarh: "Pithoragarh",
        Rudraprayag: "Rudraprayag",
        "Tehri Garhwal": "Tehri Garhwal",
        "Udham Singh Nagar": "Udham Singh Nagar",
        Uttarkashi: "Uttarkashi",
      },
      WB: {
        Alipurduar: "Alipurduar",
        Bankura: "Bankura",
        Birbhum: "Birbhum",
        "Cooch Behar": "Cooch Behar",
        "Dakshin Dinajpur": "Dakshin Dinajpur",
        Darjeeling: "Darjeeling",
        Hooghly: "Hooghly",
        Howrah: "Howrah",
        Jalpaiguri: "Jalpaiguri",
        Jhargram: "Jhargram",
        Kalimpong: "Kalimpong",
        Kolkata: "Kolkata",
        Malda: "Malda",
        Murshidabad: "Murshidabad",
        Nadia: "Nadia",
        "North 24 Parganas": "North 24 Parganas",
        "Paschim Medinipur": "Paschim Medinipur",
        "Paschim Burdwan": "Paschim Burdwan",
        "Purba Medinipur": "Purba Medinipur",
        "Purba Burdwan": "Purba Burdwan",
        Purulia: "Purulia",
        "South 24 Parganas": "South 24 Parganas",
        "Uttar Dinajpur": "Uttar Dinajpur",
      },
    },
  },
  hi: {
    language_name: "हिन्दी",
    nav_home: "होम",
    nav_how_it_works: "यह कैसे काम करता है",
    nav_features: "विशेषताएँ",
    nav_faq: "सामान्य प्रश्न",
    nav_team: "टीम",
    nav_contact: "संपर्क",
    nav_gemini_qa: "एग्रीवाइजर AI",
    nav_login: "लॉग इन करें",
    nav_register: "रजिस्टर करें",
    hero_title_1: "सफल फसल",
    hero_title_2: "आपकी फसल, हमारा मार्गदर्शन",
    hero_subtitle:
      "स्मार्ट खेती के निर्णय लेने के लिए वास्तविक समय के मौसम, मिट्टी के डेटा और बाजार की कीमतों का लाभ उठाएं।",
    hero_get_started: "शुरू करें",
    form_crop_name: "फसल का नाम",
    form_area: "क्षेत्र (एकड़)",
    form_planting_date: "रोपण तिथि",
    form_state: "राज्य",
    form_select_state: "राज्य चुनें",
    form_district: "जिला",
    form_select_district: "जिला चुनें",
    form_soil_type: "मिट्टी का प्रकार",
    form_soil_ph: "मिट्टी का पीएच",
    form_predict_button: "उपज की भविष्यवाणी करें और सिफारिशें प्राप्त करें",
    prediction_card_title: "अपनी भविष्यवाणी शुरू करें",
    prediction_card_desc:
      "हमारा एआई-संचालित उपकरण आपकी फसल की उपज का पूर्वानुमान और सिफारिशें प्रदान करने के लिए आपके खेत की अनूठी स्थितियों का विश्लेषण करता है—मिट्टी के प्रकार और स्थानीय मौसम के पैटर्न से लेकर बाजार के रुझान तक। अपनी फसल को अनुकूलित करने और लाभप्रदता को अधिकतम करने के लिए आवश्यक जानकारी प्राप्त करें।",
    prediction_card_button: "अभी शुरू करें",
    loading_text:
      "डेटा का विश्लेषण, लाइव मौसम की जानकारी और भविष्यवाणियां उत्पन्न हो रही हैं...",
    alert_fill_fields: "कृपया सभी आवश्यक फ़ील्ड भरें।",
    alert_no_coords: "चयनित जिले के लिए निर्देशांक नहीं मिल सके।",
    alert_select_state_district: "कृपया पहले एक राज्य और जिला चुनें।",
    alert_weather_fail:
      "लाइव मौसम डेटा प्राप्त करने में विफल। कृपया बाद में पुनः प्रयास करें।",
    results_analysis_for: "{district} में {crop} के लिए विश्लेषण",
    results_expected_yield: "अपेक्षित उपज",
    results_tonnes: "टन",
    results_harvest_window: "कटाई की अवधि",
    results_to: "से",
    results_weather_now: "अभी का मौसम",
    results_soil_details: "मिट्टी का विवरण",
    card_crop_recs: "सर्वश्रेष्ठ फसल सिफारिशें",
    card_crop_recs_subtitle:
      "आपके स्थान की जलवायु, मिट्टी और चयनित रोपण मौसम ({season}) के आधार पर।",
    card_suitability_score: "उपयुक्तता स्कोर (6 में से)",
    card_top_5_crops: "शीर्ष 5 अनुशंसित फसलें",
    card_no_recs: "दी गई शर्तों के लिए उपयुक्त फसल सिफारिशें नहीं मिल सकीं।",
    card_disclaimer:
      "अस्वीकरण: यह सार्वजनिक डेटासेट पर आधारित स्वचालित मार्गदर्शन है। अंतिम निर्णयों के लिए स्थानीय विशेषज्ञों से परामर्श करें।",
    card_financials: "वित्तीय अनुमान",
    card_market_price: "बाजार मूल्य (₹ प्रति क्विंटल)",
    card_total_cost: "कुल लागत",
    card_total_revenue: "कुल राजस्व",
    card_estimated_profit: "अनुमानित लाभ",
    card_profitability_breakdown: "लाभप्रदता का विश्लेषण",
    card_market_trends: "बाजार मूल्य रुझान (पिछले 30 दिन)",
    card_price_per_quintal: "मूल्य प्रति क्विंटल (₹)",
    card_market_trends_min: "न्यूनतम मूल्य",
    card_market_trends_modal: "मोडल मूल्य",
    card_market_trends_max: "अधिकतम मूल्य",
    card_historical_weather: "ऐतिहासिक मौसम (पिछला वर्ष)",
    card_temp_humidity: "तापमान और आर्द्रता",
    card_weekly_forecast: "7-दिन का मौसम पूर्वानुमान",
    planting_suitability_title: "रोपण उपयुक्तता (अगले 3 दिन)",
    planting_suitable_true: "रोपण के लिए अच्छा",
    planting_suitable_false: "रोपण के लिए आदर्श नहीं",
    reason_temp_high: "औसत तापमान बहुत अधिक",
    reason_temp_low: "औसत तापमान बहुत कम",
    reason_humidity_high: "औसत आर्द्रता बहुत अधिक",
    reason_humidity_low: "औसत आर्द्रता बहुत कम",
    how_it_works_title: "यह कैसे काम करता है",
    how_it_works_p1:
      "हमारा प्लेटफ़ॉर्म जटिल कृषि योजना को एक सहज, चरण-दर-चरण प्रक्रिया में सरल बनाता है। आपके इनपुट से लेकर आपकी व्यक्तिगत उपज की भविष्यवाणी तक डेटा यात्रा का विवरण यहां दिया गया है:",
    how_it_works_l1:
      "उपयोगकर्ता इनपुट: आप मुख्य विवरण प्रदान करते हैं: फसल, स्थान, क्षेत्र, मिट्टी और रोपण की तारीख।",
    how_it_works_l2:
      "भू-स्थानिक और मिट्टी डेटा: हम आपके जिले को निर्देशांक में परिवर्तित करते हैं और वैश्विक डेटाबेस से स्थानीय मिट्टी डेटा प्राप्त करते हैं।",
    how_it_works_l3:
      "मौसम डेटा प्राप्त करें: हम आपके विशिष्ट स्थान के लिए वास्तविक समय के पूर्वानुमान और ऐतिहासिक जलवायु डेटा प्राप्त करते हैं।",
    how_it_works_l4:
      "फसल सिफारिश: सिस्टम आपकी स्थानीय परिस्थितियों का विश्लेषण करके सबसे उपयुक्त फसलों की सिफारिश करता है।",
    how_it_works_l5:
      "एआई-आधारित उपज गणना: हमारा मॉडल एक परिष्कृत भविष्यवाणी बनाने के लिए ऐतिहासिक मौसम, मिट्टी के प्रकार और अन्य कारकों का उपयोग करके आधारभूत उपज को समायोजित करता है।",
    how_it_works_l6:
      "बाजार मूल्य विश्लेषण: हम संभावित राजस्व को समझने में आपकी मदद करने के लिए मूल्य प्रवृत्तियों को प्राप्त करने का अनुकरण करते हैं।",
    how_it_works_l7:
      "डेटा विज़ुअलाइज़ेशन: सभी संसाधित डेटा को समझने में आसान चार्ट में प्रस्तुत किया जाता है।",
    features_title: "प्लेटफ़ॉर्म की विशेषताएँ",
    features_f1_title: "एआई उपज भविष्यवाणी",
    features_f1_text:
      "परिष्कृत मॉडल जो अधिक सटीक उपज पूर्वानुमान देने के लिए आधारभूत औसत से आगे जाते हैं।",
    features_f2_title: "डेटा-संचालित सिफारिशें",
    features_f2_text:
      "आपके स्थान के मौसम, मिट्टी के प्रकार और जलवायु डेटा के आधार पर सबसे उपयुक्त फसलों का सुझाव देता है।",
    features_f3_title: "लाइव मौसम और पूर्वानुमान",
    features_f3_text:
      "वास्तविक समय के तापमान और आर्द्रता रीडिंग, साथ ही विस्तृत पूर्वानुमान प्राप्त करें।",
    features_f4_title: "ऐतिहासिक जलवायु विश्लेषण",
    features_f4_text:
      "भविष्यवाणियों को बेहतर ढंग से सूचित करने के लिए आपके क्षेत्र में दीर्घकालिक मौसम पैटर्न को समझता है।",
    features_f5_title: "इंटरैक्टिव विज़ुअलाइज़ेशन",
    features_f5_text:
      "ऐतिहासिक मौसम, बाजार की कीमतों और फसल उपयुक्तता के लिए उत्तरदायी चार्ट के साथ रुझानों का विश्लेषण करें।",
    features_f6_title: "जेमिनी-संचालित प्रश्नोत्तर",
    features_f6_text:
      "कृषि विषयों पर तत्काल जानकारी के लिए हमारे एकीकृत एआई सहायक से पूछें।",
    features_note_title: "कृपया ध्यान दें:",
    features_note_text:
      "यह प्लेटफ़ॉर्म एक प्रोटोटाइप है। उपज की भविष्यवाणियां सांख्यिकीय मॉडल और सार्वजनिक डेटा पर आधारित हैं, और इसे गारंटी के रूप में नहीं, बल्कि मार्गदर्शन के रूप में उपयोग किया जाना चाहिए। हमेशा स्थानीय कृषि विशेषज्ञों से परामर्श करें।",
    faq_title: "अक्सर पूछे जाने वाले प्रश्न",
    faq_q1_title: "डेटा कितनी बार ताज़ा किया जाता है?",
    faq_q1_text:
      "आपके अनुरोध पर वर्तमान मौसम डेटा वास्तविक समय में प्राप्त किया जाता है। बाजार मूल्य डेटा का दैनिक अनुकरण किया जाता है। ऐतिहासिक डेटासेट समय-समय पर अपडेट किए जाते हैं।",
    faq_q2_title: "उपज की भविष्यवाणी की सीमाएं क्या हैं?",
    faq_q2_text:
      "हमारा मॉडल आधारभूत उपज को परिष्कृत करने के लिए ऐतिहासिक मौसम और मिट्टी के डेटा का उपयोग करता है। यह एक शक्तिशाली अनुमान उपकरण है लेकिन अभी तक बीज की गुणवत्ता, कीट घटना, या बढ़ते मौसम के दौरान विशिष्ट मौसम की घटनाओं जैसे सूक्ष्म-चरों का हिसाब नहीं रखता है।",
    faq_q3_title: "एपीआई कुंजी कैसे संभाली जाती हैं?",
    faq_q3_text:
      "इस प्रोटोटाइप में, एपीआई कुंजी प्रदर्शन के लिए ब्राउज़र में प्रबंधित की जाती हैं। एक उत्पादन परिनियोजन में, सभी एपीआई कुंजी को एक सर्वर पर सुरक्षित वातावरण चर के रूप में संग्रहीत किया जाना चाहिए, और कॉल को बैकएंड के माध्यम से रूट किया जाएगा।",
    faq_q4_title: "बाजार मूल्य डेटा कहाँ से आता है?",
    faq_q4_text:
      "वर्तमान में, बाजार डेटा का वास्तविक रूप से अनुकरण किया जाता है। हमारा सिस्टम बैकएंड सेवाओं से जुड़ने के लिए डिज़ाइन किया गया है जो लाइव कीमतों के लिए एगमार्कनेट और ई-नाम जैसे आधिकारिक सरकारी स्रोतों से पूछताछ करेगा।",
    team_title: "हमारी टीम",
    team_subtitle:
      "हम कृषिविज्ञानी, इंजीनियरों और डिजाइनरों की एक समर्पित टीम हैं जो टिकाऊ और लाभदायक कृषि का समर्थन करने वाले उपकरण बनाने के लिए प्रतिबद्ध हैं।",
    contact_title: "हमसे संपर्क करें",
    contact_subtitle:
      "कोई प्रश्न, प्रतिक्रिया, या साझेदारी पूछताछ है? हम आपसे सुनना पसंद करेंगे।",
    contact_name: "पूरा नाम",
    contact_email: "ईमेल पता",
    contact_message: "संदेश",
    contact_send: "संदेश भेजें",
    contact_alert:
      "संदेश भेजा गया! हम 2-3 व्यावसायिक दिनों के भीतर आपसे संपर्क करेंगे।",
    login_page_title: "अपने खाते में लॉग इन करें",
    login_email: "ईमेल पता",
    login_password: "पासवर्ड",
    login_button: "लॉग इन करें",
    login_forgot_password: "पासवर्ड भूल गए?",
    login_no_account: "खाता नहीं है?",
    login_signup_link: "साइन अप करें",
    register_page_title: "खाता बनाएं",
    register_name: "पूरा नाम",
    register_email: "ईमेल पता",
    register_password: "पासवर्ड",
    register_confirm_password: "पासवर्ड की पुष्टि कीजिये",
    register_button: "रजिस्टर करें",
    register_has_account: "पहले से ही एक खाता है?",
    register_login_link: "लॉग इन करें",
    gemini_title: "एग्रीवाइजर AI से पूछें",
    gemini_subtitle: "आपका AI कृषि सहायक",
    gemini_placeholder:
      "फसलों, मिट्टी, या बाजार की कीमतों के बारे में पूछें...",
    gemini_welcome:
      "नमस्ते! मैं एग्रीवाइजर हूं, आपका एआई कृषि सहायक। आज मैं आपके खेती के सवालों में आपकी कैसे मदद कर सकता हूं?",
    gemini_error:
      "एक त्रुटि हुई: {error}। कृपया सुनिश्चित करें कि एपीआई कुंजी सही ढंग से कॉन्फ़िगर की गई है।",
    gemini_no_response: "मुझे खेद है, मैं कोई प्रतिक्रिया उत्पन्न नहीं कर सका।",
    card_management_recs: "फसल प्रबंधन",
    card_no_management_data:
      "इस फसल के लिए प्रबंधन सिफारिशें अभी उपलब्ध नहीं हैं।",
    management_fertilizer_title: "पोषक तत्व प्रबंधन",
    management_pest_title: "कीट और रोग नियंत्रण",
    management_bajra_fert_rec_1:
      "वर्षा आधारित एनपीके अनुपात: 40:20:20 किग्रा/हेक्टेयर।",
    management_bajra_fert_rec_2:
      "सिंचित एनपीके अनुपात: 60:30:30 किग्रा/हेक्टेयर।",
    management_bajra_fert_rec_3:
      "आधी नाइट्रोजन और पूरी फॉस्फोरस और पोटेशियम को आधार खुराक के रूप में डालें। बची हुई नाइट्रोजन को बुवाई के 30 दिन बाद डालें।",
    management_bajra_fert_rec_4:
      "जस्ता की कमी वाली मिट्टी में, बुवाई के समय 10 किग्रा/हेक्टेयर जिंक सल्फेट डालें।",
    management_bajra_pest_1_name: "तना मक्खी",
    management_bajra_pest_1_control:
      "इमिडाक्लोप्रिड 70 डब्ल्यूएस से बीज उपचार करें। समय पर बुवाई से संक्रमण से बचने में मदद मिलती है।",
    management_bajra_pest_2_name: "तना छेदक",
    management_bajra_pest_2_control:
      "कार्बेरिल 50 डब्ल्यूपी या डाइमेथोएट 30 ईसी का छिड़काव करें।",
    management_bajra_pest_3_name: "डाउनी मिल्ड्यू",
    management_bajra_pest_3_control:
      "प्रतिरोधी किस्मों का उपयोग करें। मेटालैक्सिल से बीज उपचार करें। मेटालैक्सिल + मैनकोजेब का छिड़काव करें।",
    management_banana_fert_rec_1:
      "उच्च पोषक तत्व की आवश्यकता: 200-300 ग्राम एन, 60-90 ग्राम पी, 300-400 ग्राम के प्रति पौधा प्रति वर्ष।",
    management_banana_fert_rec_2:
      "सर्वोत्तम परिणामों के लिए पोषक तत्वों को 5-6 विभाजित खुराकों में फर्टिगेशन के माध्यम से डालें।",
    management_banana_fert_rec_3:
      "रोपण के समय प्रति पौधा 10-15 किग्रा गोबर की खाद (एफवाईएम) डालें।",
    management_banana_fert_rec_4:
      "सूक्ष्म पोषक तत्वों (जिंक, बोरॉन) का छिड़काव फलों के विकास के लिए फायदेमंद होता है।",
    management_banana_pest_1_name: "राइजोम वीविल",
    management_banana_pest_1_control:
      "स्वस्थ, कीट-मुक्त कंदों का उपयोग करें। पौधे के आधार के चारों ओर कार्बोफ्यूरान 3जी दाने डालें।",
    management_banana_pest_2_name: "स्यूडोस्टेम बोरर",
    management_banana_pest_2_control:
      "बागान को साफ रखें। तने में मोनोक्रोटोफॉस 36 एसएल इंजेक्ट करें।",
    management_banana_pest_3_name: "पनामा विल्ट",
    management_banana_pest_3_control:
      "प्रतिरोधी किस्मों (जैसे, जी-9) का उपयोग करें। मिट्टी की जल निकासी में सुधार करें। मिट्टी को कार्बेन्डाजिम से भिगोएँ।",
    management_barley_fert_rec_1:
      "सिंचित एनपीके अनुपात: 60:30:20 किग्रा/हेक्टेयर।",
    management_barley_fert_rec_2:
      "वर्षा आधारित एनपीके अनुपात: 40:20:10 किग्रा/हेक्टेयर।",
    management_barley_fert_rec_3:
      "बुवाई के समय आधा एन + पूरा पी और के डालें। पहली सिंचाई पर बची हुई एन का टॉप ड्रेस करें।",
    management_barley_fert_rec_4:
      "सल्फर की कमी वाली मिट्टी में, 20 किग्रा/हेक्टेयर सल्फर डालें।",
    management_barley_pest_1_name: "एफिड्स",
    management_barley_pest_1_control:
      "यदि संक्रमण अधिक हो तो डाइमेथोएट 30 ईसी या इमिडाक्लोप्रिड 17.8 एसएल का छिड़काव करें।",
    management_barley_pest_2_name: "पीला रस्ट",
    management_barley_pest_2_control:
      "प्रतिरोधी किस्में उगाएं। प्रोपिकोनाज़ोल या टेबुकोनाज़ोल का छिड़काव करें।",
    management_barley_pest_3_name: "लूज स्मट",
    management_barley_pest_3_control:
      "बुवाई से पहले बीजों को वीटावैक्स या कार्बोक्सिन से उपचारित करें।",
    management_chilli_fert_rec_1:
      "सामान्य एनपीके अनुपात: 120:60:80 किग्रा/हेक्टेयर।",
    management_chilli_fert_rec_2:
      "25 टन/हेक्टेयर की दर से एफवाईएम डालें। आधा एन + पूरा पी और के आधार के रूप में डालें। बची हुई एन को 2 भागों में टॉप ड्रेस करें।",
    management_chilli_fert_rec_3:
      "फूल आने और फल लगने की अवस्था में पानी में घुलनशील उर्वरकों का पर्णीय छिड़काव उपज में सुधार करता है।",
    management_chilli_pest_1_name: "थ्रिप्स और माइट्स",
    management_chilli_pest_1_control:
      "फिप्रोनिल 5 एससी या स्पाइरोमेसिफेन 22.9 एससी का छिड़काव करें। निगरानी के लिए पीले चिपचिपे जाल।",
    management_chilli_pest_2_name: "फल छेदक",
    management_chilli_pest_2_control:
      "इमामेक्टिन बेंजोएट 5 एसजी या क्लोरेंट्रानिलिप्रोएल 18.5 एससी का छिड़काव करें।",
    management_chilli_pest_3_name: "एन्थ्रेक्नोज और पाउडरी मिल्ड्यू",
    management_chilli_pest_3_control:
      "एन्थ्रेक्नोज के लिए मैनकोजेब और पाउडरी मिल्ड्यू के लिए वेटेबल सल्फर का छिड़काव करें।",
    management_coconut_fert_rec_1:
      "प्रति ताड़ प्रति वर्ष 500 ग्राम एन, 320 ग्राम पी2ओ5, 1200 ग्राम के2ओ को दो बराबर भागों में (मानसून से पहले और बाद में) डालें।",
    management_coconut_fert_rec_2:
      "प्रति ताड़ प्रति वर्ष 25-50 किग्रा जैविक खाद (एफवाईएम या कम्पोस्ट) डालें।",
    management_coconut_fert_rec_3:
      "ताड़ के चारों ओर 1.8 मीटर त्रिज्या के गोलाकार बेसिन में उर्वरक डालें।",
    management_coconut_fert_rec_4:
      "साधारण नमक (1 किग्रा/ताड़) नारियल के आकार और उपज में सुधार कर सकता है।",
    management_coconut_pest_1_name: "गैंडा बीटल",
    management_coconut_pest_1_control:
      "ताज की सफाई। फेरोमोन ट्रैप का उपयोग करें। पत्ती की धुरी में नेफ़थलीन गेंदों के साथ मिली हुई रेत रखें।",
    management_coconut_pest_2_name: "लाल ताड़ घुन",
    management_coconut_pest_2_control:
      "ताड़ को चोट लगने से बचाएं। इमिडाक्लोप्रिड के साथ तना इंजेक्शन।",
    management_coconut_pest_3_name: "कली सड़न",
    management_coconut_pest_3_control:
      "प्रभावित ऊतकों को काट कर हटा दें। ताज को 1% बोर्डो मिश्रण से भिगोएँ।",
    management_cotton_fert_rec_1:
      "सिंचित एनपीके अनुपात: 100:50:50 किग्रा/हेक्टेयर।",
    management_cotton_fert_rec_2:
      "वर्षा आधारित एनपीके अनुपात: 80:40:40 किग्रा/हेक्टेयर।",
    management_cotton_fert_rec_3:
      "नाइट्रोजन को 2-3 भागों में डालें; पूरा फॉस्फोरस और पोटेशियम आधार खुराक के रूप में दें।",
    management_cotton_fert_rec_4:
      "फूल आने पर 2% डीएपी का पर्णीय छिड़काव बॉल्स के विकास को बढ़ाता है।",
    management_cotton_fert_rec_5:
      "पोषक तत्वों के अवशोषण को बेहतर बनाने के लिए जैव उर्वरकों (एज़ोटोबैक्टर, पीएसबी) का उपयोग करें।",
    management_cotton_pest_1_name: "बॉलवर्म (गुलाबी, अमेरिकी)",
    management_cotton_pest_1_control:
      "निगरानी के लिए फेरोमोन ट्रैप (4-5/एकड़) का प्रयोग करें। यदि संक्रमण ईटीएल को पार कर जाता है तो इमामेक्टिन बेंजोएट 5 एसजी या क्लोरेंट्रानिलिप्रोएल 18.5 एससी का छिड़काव करें।",
    management_cotton_pest_2_name:
      "चूसने वाले कीट (एफिड्स, जैसिड्स, सफेद मक्खी)",
    management_cotton_pest_2_control:
      "इमिडाक्लोप्रिड 17.8 एसएल या एसिटामिप्रिड 20 एसपी जैसे प्रणालीगत कीटनाशकों का छिड़काव करें। नीम का तेल (1500 पीपीएम) एक प्रभावी जैविक विकल्प है।",
    management_ginger_fert_rec_1: "25-30 टन/हेक्टेयर एफवाईएम की आधार खुराक।",
    management_ginger_fert_rec_2: "एनपीके अनुपात: 75:50:50 किग्रा/हेक्टेयर।",
    management_ginger_fert_rec_3:
      "रोपण के समय पूरा पी और आधा के डालें। रोपण के 45 और 90 दिनों में दो भागों में एन और शेष के डालें।",
    management_ginger_fert_rec_4:
      "नमी बनाए रखने और खरपतवारों को नियंत्रित करने के लिए रोपण के बाद मल्चिंग आवश्यक है।",
    management_ginger_pest_1_name: "तना छेदक",
    management_ginger_pest_1_control:
      "डाइमेथोएट 30 ईसी या क्विनालफॉस 25 ईसी का छिड़काव करें।",
    management_ginger_pest_2_name: "नरम सड़न",
    management_ginger_pest_2_control:
      "अच्छी जल निकासी सुनिश्चित करें। बीज प्रकंदों को मैनकोजेब घोल से उपचारित करें। मिट्टी को मेटालैक्सिल से भिगोएँ।",
    management_gram_fert_rec_1:
      "एनपीके अनुपात: 20:60:20 किग्रा/हेक्टेयर। सभी को आधार खुराक के रूप में डालें।",
    management_gram_fert_rec_2:
      "नाइट्रोजन स्थिरीकरण को बढ़ाने के लिए बुवाई से पहले बीजों को राइजोबियम कल्चर से उपचारित करें।",
    management_gram_fert_rec_3:
      "20 किग्रा/हेक्टेयर सल्फर का प्रयोग फायदेमंद है, खासकर तिलहन उगाने वाले क्षेत्रों में।",
    management_gram_pest_1_name: "फली छेदक (हेलिकोवर्पा)",
    management_gram_pest_1_control:
      "फेरोमोन ट्रैप स्थापित करें। पहले नीम के बीज की गिरी का अर्क (NSKE) 5% का छिड़काव करें। यदि आवश्यक हो, तो इमामेक्टिन बेंजोएट 5 एसजी का छिड़काव करें।",
    management_gram_pest_2_name: "फ्यूजेरियम विल्ट",
    management_gram_pest_2_control:
      "प्रतिरोधी किस्मों का उपयोग करें। ट्राइकोडर्मा विरिडी से बीज उपचार। गहरी गर्मी की जुताई।",
    management_grapes_fert_rec_1:
      "उर्वरक अनुसूची विकास के चरण पर निर्भर करती है (छंटाई, फूल आने, फल लगने के बाद)।",
    management_grapes_fert_rec_2:
      "परिपक्व बेलों (4 साल बाद) को प्रति बेल प्रति वर्ष विभाजित खुराकों में 500:500:1000 ग्राम एनपीके की आवश्यकता हो सकती है।",
    management_grapes_fert_rec_3:
      "प्रति बेल प्रति वर्ष 20-30 किग्रा एफवाईएम डालें।",
    management_grapes_fert_rec_4:
      "कुशल पोषक तत्व वितरण के लिए फर्टिगेशन का उपयोग करें।",
    management_grapes_pest_1_name: "मिलीबग",
    management_grapes_pest_1_control:
      "बुप्रोफेज़िन 25 एससी या इमिडाक्लोप्रिड 17.8 एसएल का छिड़काव करें।",
    management_grapes_pest_2_name: "डाउनी और पाउडरी मिल्ड्यू",
    management_grapes_pest_2_control:
      "निवारक छिड़काव महत्वपूर्ण हैं। डाउनी मिल्ड्यू के लिए मैनकोजेब और पाउडरी मिल्ड्यू के लिए सल्फर/हेक्साकोनाज़ोल का उपयोग करें।",
    management_groundnut_fert_rec_1:
      "वर्षा आधारित एनपीके अनुपात: 20:40:40 किग्रा/हेक्टेयर।",
    management_groundnut_fert_rec_2:
      "सिंचित एनपीके अनुपात: 25:50:75 किग्रा/हेक्टेयर।",
    management_groundnut_fert_rec_3:
      "बेहतर फली विकास के लिए फूल आने के दौरान 250 किग्रा/हेक्टेयर जिप्सम डालें।",
    management_groundnut_fert_rec_4:
      "राइजोबियम से बीज उपचार की सिफारिश की जाती है।",
    management_groundnut_pest_1_name: "पत्ती सुरंगक",
    management_groundnut_pest_1_control:
      "डाइमेथोएट 30 ईसी या क्विनालफॉस 25 ईसी का छिड़काव करें।",
    management_groundnut_pest_2_name: "टिक्का पत्ती धब्बा",
    management_groundnut_pest_2_control:
      "कार्बेन्डाजिम + मैनकोजेब या क्लोरोथालोनिल 75 डब्ल्यूपी का छिड़काव करें।",
    management_jowar_fert_rec_1:
      "सिंचित एनपीके अनुपात: 80:40:40 किग्रा/हेक्टेयर।",
    management_jowar_fert_rec_2:
      "वर्षा आधारित एनपीके अनुपात: 40:20:20 किग्रा/हेक्टेयर।",
    management_jowar_fert_rec_3:
      "आधी एन और पूरी पी और के को आधार खुराक के रूप में डालें। बुवाई के 30-35 दिन बाद बची हुई एन का टॉप ड्रेस करें।",
    management_jowar_pest_1_name: "तना मक्खी",
    management_jowar_pest_1_control:
      "इमिडाक्लोप्रिड से बीज उपचार करें। जल्दी बुवाई से घटना कम हो सकती है।",
    management_jowar_pest_2_name: "तना छेदक",
    management_jowar_pest_2_control:
      "बुवाई के 20-25 दिन बाद व्होरल्स में कार्बोफ्यूरान 3जी दाने डालें।",
    management_jute_fert_rec_1:
      "ओलिटोरियस जूट के लिए एनपीके अनुपात: 40:20:20 किग्रा/हेक्टेयर।",
    management_jute_fert_rec_2:
      "कैप्सुलरिस जूट के लिए एनपीके अनुपात: 60:30:30 किग्रा/हेक्टेयर।",
    management_jute_fert_rec_3:
      "एन को दो भागों में डालें: आधा आधार के रूप में, आधा बुवाई के 3-4 सप्ताह बाद।",
    management_jute_fert_rec_4:
      "भूमि की तैयारी के दौरान 5-7 टन/हेक्टेयर एफवाईएम डालें।",
    management_jute_pest_1_name: "जूट सेमिलूपर",
    management_jute_pest_1_control:
      "क्लोरपाइरीफॉस 20 ईसी या क्विनालफॉस 25 ईसी का छिड़काव करें।",
    management_jute_pest_2_name: "तना सड़न",
    management_jute_pest_2_control:
      "जल निकासी में सुधार करें। कार्बेन्डाजिम से बीज उपचार करें। फसल चक्र।",
    management_lentil_fert_rec_1:
      "एनपीके अनुपात: 20:40:20 किग्रा/हेक्टेयर। सभी को आधार खुराक के रूप में डालें।",
    management_lentil_fert_rec_2: "बीजों को राइजोबियम कल्चर से उपचारित करें।",
    management_lentil_fert_rec_3:
      "20 किग्रा/हेक्टेयर सल्फर का प्रयोग उपज और प्रोटीन सामग्री को बढ़ा सकता है।",
    management_lentil_pest_1_name: "एफिड्स",
    management_lentil_pest_1_control:
      "डाइमेथोएट 30 ईसी या इमिडाक्लोप्रिड 17.8 एसएल का छिड़काव करें।",
    management_lentil_pest_2_name: "रस्ट और विल्ट",
    management_lentil_pest_2_control:
      "प्रतिरोधी किस्मों का उपयोग करें। थिरम + कार्बेन्डाजिम से बीज उपचार करें।",
    management_maize_fert_rec_1:
      "हाइब्रिड मक्का एनपीके अनुपात: 120:60:60 किग्रा/हेक्टेयर।",
    management_maize_fert_rec_2:
      "बुवाई के समय 1/3 एन और पूरा पी और के डालें। बची हुई एन को दो भागों में डालें: घुटने तक की अवस्था में और फूल आने पर।",
    management_maize_fert_rec_3:
      "जस्ता की कमी वाली मिट्टी में 25 किग्रा/हेक्टेयर जिंक सल्फेट डालें।",
    management_maize_pest_1_name: "फॉल आर्मीवर्म",
    management_maize_pest_1_control:
      "फेरोमोन ट्रैप स्थापित करें। व्होरल्स में इमामेक्टिन बेंजोएट 5 एसजी डालें।",
    management_maize_pest_2_name: "तना छेदक",
    management_maize_pest_2_control: "व्होरल में कार्बोफ्यूरान 3जी दाने डालें।",
    management_mango_fert_rec_1:
      "उर्वरक की खुराक उम्र के साथ बदलती है। एक 10 साल के पेड़ को प्रति वर्ष लगभग 1 किलो एन, 0.5 किलो पी, 1 किलो के की आवश्यकता होती है।",
    management_mango_fert_rec_2:
      "कटाई के बाद और मानसून के दौरान दो भागों में जैविक खाद (50-100 किग्रा/पेड़) और उर्वरक डालें।",
    management_mango_fert_rec_3:
      "पेड़ की छतरी के चारों ओर एक गोलाकार खाई में डालें।",
    management_mango_pest_1_name: "आम का फुदका",
    management_mango_pest_1_control:
      "फूल आने के दौरान इमिडाक्लोप्रिड 17.8 एसएल या थियामेथोक्साम 25 डब्ल्यूजी का छिड़काव करें।",
    management_mango_pest_2_name: "पाउडरी मिल्ड्यू और एन्थ्रेक्नोज",
    management_mango_pest_2_control:
      "मिल्ड्यू के लिए वेटेबल सल्फर और एन्थ्रेक्नोज के लिए कार्बेन्डाजिम का छिड़काव करें।",
    management_millet_fert_rec_1:
      "छोटे बाजरा के लिए सामान्य एनपीके अनुपात: 40:20:20 किग्रा/हेक्टेयर।",
    management_millet_fert_rec_2:
      "आधी एन और पूरी पी और के को आधार खुराक के रूप में डालें।",
    management_millet_fert_rec_3:
      "बुवाई के लगभग 30 दिन बाद बची हुई आधी एन का टॉप ड्रेस करें।",
    management_millet_pest_1_name: "तना मक्खी और तना छेदक",
    management_millet_pest_1_control:
      "छोटे बाजरा आमतौर पर हार्डी होते हैं। इमिडाक्लोप्रिड से बीज उपचार मदद कर सकता है। स्वच्छ खेती महत्वपूर्ण है।",
    management_millet_pest_2_name: "ब्लास्ट और रस्ट",
    management_millet_pest_2_control:
      "प्रतिरोधी किस्मों का उपयोग करें। आमतौर पर, छोटे बाजरा के लिए रासायनिक नियंत्रण किफायती नहीं होता है।",
    management_mustard_fert_rec_1:
      "सिंचित एनपीके अनुपात: 80:40:40 किग्रा/हेक्टेयर।",
    management_mustard_fert_rec_2:
      "सल्फर महत्वपूर्ण है: जिप्सम या बेंटोनाइट सल्फर के माध्यम से 40 किग्रा/हेक्टेयर सल्फर डालें।",
    management_mustard_fert_rec_3:
      "बुवाई के समय आधा एन और पूरा पी, के, एस डालें। पहली सिंचाई (30-35 डीएएस) पर बची हुई एन का टॉप ड्रेस करें।",
    management_mustard_pest_1_name: "सरसों एफिड",
    management_mustard_pest_1_control:
      "10-15% संक्रमण पर डाइमेथोएट 30 ईसी या इमिडाक्लोप्रिड 17.8 एसएल के साथ पहला छिड़काव करें।",
    management_mustard_pest_2_name: "सफेद रस्ट और अल्टरनेरिया ब्लाइट",
    management_mustard_pest_2_control:
      "प्रतिरोधी किस्मों का उपयोग करें। मैनकोजेब या मेटालैक्सिल का छिड़काव करें।",
    management_onion_fert_rec_1:
      "सामान्य एनपीके अनुपात: 100:50:50 किग्रा/हेक्टेयर, 50 किग्रा/हेक्टेयर सल्फर के साथ।",
    management_onion_fert_rec_2: "20-25 टन/हेक्टेयर एफवाईएम डालें।",
    management_onion_fert_rec_3:
      "आधी एन और पूरी पी, के, एस को आधार के रूप में डालें। रोपाई के 30 और 45 दिनों में दो भागों में बची हुई एन का टॉप ड्रेस करें।",
    management_onion_pest_1_name: "थ्रिप्स",
    management_onion_pest_1_control:
      "नीले चिपचिपे जाल का उपयोग करें। फिप्रोनिल 5 एससी या प्रोफेनोफोस 50 ईसी का छिड़काव करें।",
    management_onion_pest_2_name: "बैंगनी धब्बा",
    management_onion_pest_2_control:
      "मैनकोजेब + कार्बेन्डाजिम या क्लोरोथालोनिल का छिड़काव करें।",
    management_pigeonpea_fert_rec_1:
      "स्टार्टर एनपीके खुराक: 20:40:20 किग्रा/हेक्टेयर। सभी को आधार के रूप में डालें।",
    management_pigeonpea_fert_rec_2:
      "राइजोबियम और पीएसबी कल्चर के साथ बीज उपचार की अत्यधिक सिफारिश की जाती है।",
    management_pigeonpea_fert_rec_3:
      "सल्फर का प्रयोग (20 किग्रा/हेक्टेयर) उपज में सुधार कर सकता है।",
    management_pigeonpea_pest_1_name: "फली छेदक कॉम्प्लेक्स",
    management_pigeonpea_pest_1_control:
      "फेरोमोन ट्रैप से निगरानी करें। इंडोक्साकार्ब 14.5 एससी या इमामेक्टिन बेंजोएट 5 एसजी का छिड़काव करें।",
    management_pigeonpea_pest_2_name: "फ्यूजेरियम विल्ट",
    management_pigeonpea_pest_2_control:
      "प्रतिरोधी किस्मों का उपयोग करें। गहरी गर्मी की जुताई। ट्राइकोडर्मा से बीज उपचार।",
    management_potato_fert_rec_1: "एनपीके अनुपात: 120:80:100 किग्रा/हेक्टेयर।",
    management_potato_fert_rec_2: "25-30 टन/हेक्टेयर एफवाईएम डालें।",
    management_potato_fert_rec_3:
      "रोपण के समय आधा एन और पूरा पी और के डालें। मिट्टी चढ़ाने (रोपण के 25-30 दिन बाद) पर बची हुई एन डालें।",
    management_potato_pest_1_name: "एफिड्स",
    management_potato_pest_1_control:
      "वायरस के लिए वेक्टर। इमिडाक्लोप्रिड 17.8 एसएल का छिड़काव करें।",
    management_potato_pest_2_name: "लेट ब्लाइट",
    management_potato_pest_2_control:
      "महत्वपूर्ण रोग। मैनकोजेब के साथ निवारक छिड़काव। मेटालैक्सिल + मैनकोजेब या साइमोक्सानिल + मैनकोजेब के साथ उपचारात्मक छिड़काव।",
    management_ragi_fert_rec_1: "एनपीके अनुपात: 40:20:20 किग्रा/हेक्टेयर।",
    management_ragi_fert_rec_2:
      "आधी एन और पूरी पी और के को आधार खुराक के रूप में डालें।",
    management_ragi_fert_rec_3:
      "बुवाई/रोपाई के 25-30 दिन बाद बची हुई आधी एन का टॉप ड्रेस करें।",
    management_ragi_pest_1_name: "तना छेदक",
    management_ragi_pest_1_control:
      "स्वच्छ खेती। यदि गंभीर हो, तो कार्बोफ्यूरान 3जी दाने डालें।",
    management_ragi_pest_2_name: "ब्लास्ट (गर्दन और उंगली)",
    management_ragi_pest_2_control:
      "प्रतिरोधी किस्मों का उपयोग करें। कार्बेन्डाजिम से बीज उपचार। ट्राइसाइक्लाज़ोल का छिड़काव करें।",
    management_rice_fert_rec_1:
      "निचली भूमि एनपीके अनुपात: 100:60:60 किग्रा/हेक्टेयर।",
    management_rice_fert_rec_2:
      "ऊपरी भूमि एनपीके अनुपात: 90:60:60 किग्रा/हेक्टेयर।",
    management_rice_fert_rec_3:
      "नाइट्रोजन को 3 भागों में डालें: आधार, कल्ले निकलने और बाली निकलने की शुरुआत में।",
    management_rice_fert_rec_4:
      "जस्ता की कमी वाली मिट्टी में 25 किग्रा/हेक्टेयर जिंक सल्फेट मिलाएं।",
    management_rice_fert_rec_5:
      "रोपाई से पहले ढैंचा या सनई से हरी खाद देना बहुत फायदेमंद होता है।",
    management_rice_pest_1_name: "पीला तना छेदक",
    management_rice_pest_1_control:
      "फेरोमोन ट्रैप स्थापित करें। कटाई के बाद, प्यूपा को बाहर निकालने के लिए खेत की जुताई करें। कार्टैप हाइड्रोक्लोराइड 4जी या फिप्रोनिल 0.3 जीआर का छिड़काव करें।",
    management_rice_pest_2_name: "भूरा फुदका (बीपीएच)",
    management_rice_pest_2_control:
      "अत्यधिक नाइट्रोजन से बचें। बारी-बारी से गीला और सूखा बनाए रखें। पौधों के आधार पर बुप्रोफेज़िन 25 एससी या इमिडाक्लोप्रिड 17.8 एसएल का छिड़काव करें।",
    management_rice_pest_3_name: "ब्लास्ट और शीथ ब्लाइट",
    management_rice_pest_3_control:
      "ट्राइसाइक्लाज़ोल से बीज उपचार करें। नियंत्रण के लिए, ट्राइसाइक्लाज़ोल 75 डब्ल्यूपी या हेक्साकोनाज़ोल 5 ईसी का छिड़काव करें।",
    management_soybean_fert_rec_1:
      "एनपीके अनुपात: 20:60-80:40 किग्रा/हेक्टेयर। बुवाई के समय सभी डालें।",
    management_soybean_fert_rec_2:
      "राइजोबियम जैपोनिकम और पीएसबी के साथ बीज टीकाकरण आवश्यक है।",
    management_soybean_fert_rec_3:
      "बेहतर वृद्धि और तेल सामग्री के लिए 20 किग्रा/हेक्टेयर सल्फर डालें।",
    management_soybean_pest_1_name: "गर्डल बीटल और तना मक्खी",
    management_soybean_pest_1_control:
      "थियामेथोक्साम + लैम्ब्डा साइहलोथ्रिन या प्रोफेनोफोस + साइपरमेथ्रिन का छिड़काव करें।",
    management_soybean_pest_2_name: "पीला मोज़ेक वायरस",
    management_soybean_pest_2_control:
      "सफेद मक्खी द्वारा वेक्टर किया गया। प्रतिरोधी किस्मों का उपयोग करें। थियामेथोक्साम या इमिडाक्लोप्रिड से सफेद मक्खी को नियंत्रित करें।",
    management_sugarcane_fert_rec_1:
      "सामान्य एनपीके अनुपात: 275:62.5:112.5 किग्रा/हेक्टेयर।",
    management_sugarcane_fert_rec_2:
      "नाइट्रोजन को 3 भागों में डालें (रोपण के 30, 60, 90 दिन बाद)।",
    management_sugarcane_fert_rec_3:
      "आखिरी जुताई से पहले 12.5 टन/हेक्टेयर गोबर की खाद (एफवाईएम) डालें।",
    management_sugarcane_fert_rec_4:
      "पोषक तत्वों की उपलब्धता बढ़ाने के लिए एज़ोस्पिरिलम और फॉस्फोबैक्टीरिया जैसे जैव उर्वरकों का उपयोग करें।",
    management_sugarcane_fert_rec_5:
      "कचरा मल्चिंग नमी बनाए रखने में मदद करता है और जैविक पदार्थ जोड़ता है।",
    management_sugarcane_pest_1_name: "प्रारंभिक तना छेदक",
    management_sugarcane_pest_1_control:
      "रोपण के बाद कचरा मल्चिंग। प्रकाश जाल स्थापित करें। मिट्टी में क्लोरेंट्रानिलिप्रोएल 0.4 जीआर या फिप्रोनिल 0.3 जीआर डालें।",
    management_sugarcane_pest_2_name: "दीमक",
    management_sugarcane_pest_2_control:
      "रोपण से पहले क्लोरपाइरीफॉस 20 ईसी या इमिडाक्लोप्रिड 70 डब्ल्यूएस घोल से सेट का उपचार करें।",
    management_sugarcane_pest_3_name: "लाल सड़न",
    management_sugarcane_pest_3_control:
      "रोग मुक्त सेट का उपयोग करें। कार्बेन्डाजिम 50 डब्ल्यूपी से सेट उपचार। प्रभावित गुच्छों को हटा दें और नष्ट कर दें।",
    management_tea_fert_rec_1:
      "पोषक तत्व का प्रयोग छंटाई चक्र और अपेक्षित उपज पर आधारित है।",
    management_tea_fert_rec_2:
      "एक सामान्य N:K अनुपात युवा चाय के लिए 2:1 और परिपक्व चाय के लिए 1:1 है।",
    management_tea_fert_rec_3:
      "बर्बादी से बचने के लिए प्रति वर्ष 4-6 विभाजित खुराकों में उर्वरक डालें।",
    management_tea_fert_rec_4:
      "जिंक, मैग्नीशियम और बोरॉन का पर्णीय प्रयोग एक आम प्रथा है।",
    management_tea_pest_1_name: "चाय मच्छर बग",
    management_tea_pest_1_control:
      "थियामेथोक्साम + लैम्ब्डा साइहलोथ्रिन का छिड़काव करें।",
    management_tea_pest_2_name: "लाल मकड़ी माइट",
    management_tea_pest_2_control:
      "प्रोपारगाइट 57 ईसी या फेनपाइरोक्सिमेट 5 ईसी का छिड़काव करें।",
    management_tea_pest_3_name: "ब्लिस्टर ब्लाइट",
    management_tea_pest_3_control:
      "नियमित तुड़ाई से रोग कम होता है। मानसून के दौरान हेक्साकोनाज़ोल + कॉपर ऑक्सीक्लोराइड का छिड़काव करें।",
    management_tomato_fert_rec_1:
      "हाइब्रिड एनपीके अनुपात: 120:80:80 किग्रा/हेक्टेयर।",
    management_tomato_fert_rec_2:
      "भूमि की तैयारी के दौरान 25 टन/हेक्टेयर एफवाईएम डालें।",
    management_tomato_fert_rec_3:
      "आधी एन और पूरी पी और के को आधार के रूप में डालें। रोपाई के 30 और 45 दिनों में बची हुई एन को भागों में डालें।",
    management_tomato_fert_rec_4:
      "फूल-छोर सड़न को रोकने के लिए कैल्शियम महत्वपूर्ण है। फर्टिगेशन के लिए कैल्शियम नाइट्रेट का उपयोग करें।",
    management_tomato_pest_1_name: "फल छेदक (हेलिकोवर्पा)",
    management_tomato_pest_1_control:
      "निगरानी के लिए फेरोमोन ट्रैप। इमामेक्टिन बेंजोएट 5 एसजी का छिड़काव करें।",
    management_tomato_pest_2_name: "पत्ती कर्ल वायरस",
    management_tomato_pest_2_control:
      "सफेद मक्खी द्वारा वेक्टर किया गया। प्रतिरोधी हाइब्रिड का उपयोग करें। पीले चिपचिपे जाल और इमिडाक्लोप्रिड के छिड़काव से सफेद मक्खी को नियंत्रित करें।",
    management_turmeric_fert_rec_1:
      "आधार खुराक के रूप में 30 टन/हेक्टेयर एफवाईएम या कम्पोस्ट डालें।",
    management_turmeric_fert_rec_2: "एनपीके अनुपात: 60:50:120 किग्रा/हेक्टेयर।",
    management_turmeric_fert_rec_3:
      "पूरी पी और आधी के को आधार के रूप में डालें। रोपण के 45 और 90 दिनों में दो भागों में एन और शेष के डालें।",
    management_turmeric_fert_rec_4:
      "रोपण के तुरंत बाद हरी पत्तियों से खेत को मल्च करें।",
    management_turmeric_pest_1_name: "तना छेदक",
    management_turmeric_pest_1_control:
      "मैलाथियान 50 ईसी या डाइमेथोएट 30 ईसी का छिड़काव करें।",
    management_turmeric_pest_2_name: "राइजोम सड़न",
    management_turmeric_pest_2_control:
      "उत्कृष्ट जल निकासी सुनिश्चित करें। बीज प्रकंदों का उपचार करें और मिट्टी को मैनकोजेब या मेटालैक्सिल से भिगोएँ।",
    management_wheat_fert_rec_1:
      "सिंचित एनपीके अनुपात: 120:60:40 किग्रा/हेक्टेयर।",
    management_wheat_fert_rec_2:
      "बुवाई के समय 1/2 नाइट्रोजन खुराक + पूरा पी और के डालें। पहली सिंचाई पर बची हुई एन डालें।",
    management_wheat_fert_rec_3:
      "देर से बोए गए गेहूं के लिए, एन खुराक 25% बढ़ाएं।",
    management_wheat_fert_rec_4:
      "सल्फर की कमी वाली मिट्टी में 20 किग्रा/हेक्टेयर सल्फर डालें।",
    management_wheat_fert_rec_5:
      "सटीक उर्वरक प्रयोग के लिए मिट्टी का परीक्षण महत्वपूर्ण है।",
    management_wheat_pest_1_name: "एफिड्स",
    management_wheat_pest_1_control:
      "लेडीबर्ड बीटल जैसे प्राकृतिक शिकारियों का संरक्षण करें। यदि गंभीर हो, तो थियामेथोक्साम 25 डब्ल्यूजी या इमिडाक्लोप्रिड 17.8 एसएल का छिड़काव करें।",
    management_wheat_pest_2_name: "दीमक",
    management_wheat_pest_2_control:
      "फिप्रोनिल 5 एससी से बीज उपचार करें। खड़ी फसलों के लिए, सिंचाई के पानी के साथ क्लोरपाइरीफॉस 20 ईसी डालें।",
    management_wheat_pest_3_name: "पीला रस्ट",
    management_wheat_pest_3_control:
      "प्रतिरोधी किस्मों को उगाएं। रोग के पहले संकेत पर प्रोपिकोनाज़ोल 25 ईसी या टेबुकोनाज़ोल 250 ईसी का छिड़काव करें।",
    // New Irrigation
    card_irrigation_recs: "सिंचाई प्रबंधन",
    card_no_irrigation_data:
      "इस फसल के लिए सिंचाई की सिफारिशें अभी उपलब्ध नहीं हैं।",
    irrigation_critical_stages_title: "सिंचाई के लिए महत्वपूर्ण चरण",
    irrigation_general_tips_title: "सामान्य सिंचाई युक्तियाँ",
    irrigation_wheat_cs_1: "क्राउन रूट दीक्षा (CRI) - बुवाई के 20-25 दिन बाद।",
    irrigation_wheat_cs_2: "कल्ले निकलना - 40-45 दिन बाद।",
    irrigation_wheat_cs_3: "गांठ बनने की अंतिम अवस्था - 60-65 दिन बाद।",
    irrigation_wheat_cs_4: "फूल आना - 80-85 दिन बाद।",
    irrigation_wheat_cs_5: "दुधिया अवस्था - 100-105 दिन बाद।",
    irrigation_wheat_tip_1:
      "हल्की और लगातार सिंचाई करें। महत्वपूर्ण चरणों में पानी के तनाव से बचें।",
    irrigation_wheat_tip_2:
      "पानी बचाने के लिए स्प्रिंकलर या ड्रिप सिंचाई की अत्यधिक अनुशंसा की जाती है।",
    irrigation_rice_cs_1: "सक्रिय कल्ले निकलने की अवस्था।",
    irrigation_rice_cs_2: "बाली निकलने से फूल आने तक।",
    irrigation_rice_tip_1:
      "रोपाई से लेकर कटाई से 15 दिन पहले तक खेत में 2-5 सेमी खड़ा पानी बनाए रखें।",
    irrigation_rice_tip_2:
      "महत्वपूर्ण उपज हानि के बिना पानी बचाने के लिए वैकल्पिक गीला और सुखाने (AWD) का अभ्यास करें।",
    irrigation_cotton_cs_1: "फूल आने और बॉल बनने की अवस्था सबसे महत्वपूर्ण है।",
    irrigation_cotton_tip_1:
      "कपास जलभराव के प्रति संवेदनशील है। उचित जल निकासी सुनिश्चित करें।",
    irrigation_cotton_tip_2:
      "ड्रिप सिंचाई अत्यधिक प्रभावी है, जिससे 40-50% पानी की बचत होती है और उपज बढ़ती है।",
    irrigation_sugarcane_cs_1: "रचनात्मक चरण (रोपण के बाद पहले 120 दिन)।",
    irrigation_sugarcane_cs_2: "भव्य विकास चरण।",
    irrigation_sugarcane_tip_1:
      "गर्मियों में 7-10 दिन और सर्दियों में 15-20 दिन के अंतराल पर सिंचाई करें।",
    irrigation_sugarcane_tip_2:
      "नाली सिंचाई आम है, लेकिन ड्रिप सिंचाई से पानी के उपयोग की दक्षता में काफी सुधार हो सकता है।",
    irrigation_maize_cs_1: "घुटने तक की अवस्था।",
    irrigation_maize_cs_2: "नर और मादा फूल आने की अवस्था।",
    irrigation_maize_cs_3: "दाना भरने की अवस्था।",
    irrigation_maize_tip_1:
      "फूल आने की अवधि के दौरान पानी के तनाव से बचें क्योंकि यह उपज को गंभीर रूप से प्रभावित कर सकता है।",
    irrigation_maize_tip_2:
      "सिंचाई से पहले मिट्टी की नमी की जाँच करें। मिट्टी पूरी तरह सूखी नहीं होनी चाहिए।",
    crop_names: {
      "Bajra (Pearl Millet)": "बाजरा",
      Banana: "केला",
      "Barley (Jau)": "जौ",
      Chilli: "मिर्च",
      Coconut: "नारियल",
      Cotton: "कपास",
      Ginger: "अदरक",
      "Gram (Chickpea)": "चना",
      Grapes: "अंगूर",
      Groundnut: "मूंगफली",
      "Jowar (Sorghum)": "ज्वार",
      Jute: "जूट",
      "Lentil (Masur)": "मसूर",
      Maize: "मक्का",
      Mango: "आम",
      Millet: "बाजरा",
      Mustard: "सरसों",
      Onion: "प्याज",
      "Pigeon Pea (Arhar)": "अरहर",
      Potato: "आलू",
      "Ragi (Finger Millet)": "रागी",
      Rice: "चावल",
      Soybean: "सोयाबीन",
      Sugarcane: "गन्ना",
      Tea: "चाय",
      Tomato: "टमाटर",
      Turmeric: "हल्दी",
      Wheat: "गेहूँ",
    },
    soil_types: {
      Alluvial: "जलोढ़",
      Black: "काली",
      "Red and Yellow": "लाल और पीली",
      Laterite: "लैटेराइट",
      Arid: "शुष्क",
      Forest: "वन",
      Loamy: "दोमट",
      Clayey: "चिकनी",
      Sandy: "रेतीली",
      Silty: "गाद",
      Peaty: "पीट",
    },
    states: {
      AN: "अंडमान और निकोबार द्वीप समूह",
      AP: "आंध्र प्रदेश",
      AR: "अरुणाचल प्रदेश",
      AS: "असम",
      BR: "बिहार",
      CH: "चंडीगढ़",
      CT: "छत्तीसगढ़",
      DN: "दादरा और नगर हवेली और दमन और दीव",
      DL: "दिल्ली",
      GA: "गोवा",
      GJ: "गुजरात",
      HR: "हरियाणा",
      HP: "हिमाचल प्रदेश",
      JK: "जम्मू और कश्मीर",
      JH: "झारखंड",
      KA: "कर्नाटक",
      KL: "केरल",
      LA: "लद्दाख",
      LD: "लक्षद्वीप",
      MP: "मध्य प्रदेश",
      MH: "महाराष्ट्र",
      MN: "मणिपुर",
      ML: "मेघालय",
      MZ: "मिजोरम",
      NL: "नागालैंड",
      OR: "ओडिशा",
      PY: "पुडुचेरी",
      PB: "पंजाब",
      RJ: "राजस्थान",
      SK: "सिक्किम",
      TN: "तमिलनाडु",
      TG: "तेलंगाना",
      TR: "त्रिपुरा",
      UP: "उत्तर प्रदेश",
      UT: "उत्तराखंड",
      WB: "पश्चिम बंगाल",
    },
    districts: {
      AN: {
        Nicobars: "निकोबार",
        "North and Middle Andaman": "उत्तर और मध्य अंडमान",
        "South Andaman": "दक्षिण अंडमान",
      },
      GJ: {
        Ahmedabad: "अहमदाबाद",
        Amreli: "अमरेली",
        Anand: "आणंद",
        Aravalli: "अरवल्ली",
        Banaskantha: "बनासकांठा",
        Bharuch: "भरूच",
        Bhavnagar: "भावनगर",
        Botad: "बोटाद",
        "Chhota Udepur": "छोटा उदेपुर",
        Dahod: "दाहोद",
        Dangs: "डांग",
        "Devbhoomi Dwarka": "देवभूमि द्वारका",
        Gandhinagar: "गांधीनगर",
        "Gir Somnath": "गिर सोमनाथ",
        Jamnagar: "जामनगर",
        Junagadh: "जूनागढ़",
        Kachchh: "कच्छ",
        Kheda: "खेड़ा",
        Mahisagar: "महिसागर",
        Mehsana: "मेहसाणा",
        Morbi: "मोरबी",
        Narmada: "नर्मदा",
        Navsari: "नवसारी",
        Panchmahal: "पंचमहल",
        Patan: "पाटन",
        Porbandar: "पोरबंदर",
        Rajkot: "राजकोट",
        Sabarkantha: "साबरकांठा",
        Surat: "सूरत",
        Surendranagar: "सुरेंद्रनगर",
        Tapi: "तापी",
        Vadodara: "वडोदरा",
        Valsad: "वलसाड",
      },
      UP: {
        Agra: "आगरा",
        Aligarh: "अलीगढ़",
        Prayagraj: "प्रयागराज",
        "Ambedkar Nagar": "अंबेडकर नगर",
        Amethi: "अमेठी",
        Amroha: "अमरोहा",
        Auraiya: "औरैया",
        Azamgarh: "आजमगढ़",
        Baghpat: "बागपत",
        Bahraich: "बहराइच",
        Ballia: "बलिया",
        Balrampur: "बलरामपुर",
        Banda: "बांदा",
        Barabanki: "बाराबंकी",
        Bareilly: "बरेली",
        Basti: "बस्ती",
        Bhadohi: "भदोही",
        Bijnor: "बिजनौर",
        Budaun: "बदायूं",
        Bulandshahr: "बुलंदशहर",
        Chandauli: "चंदौली",
        Chitrakoot: "चित्रकूट",
        Deoria: "देवरिया",
        Etah: "एटा",
        Etawah: "इटावा",
        Ayodhya: "अयोध्या",
        Farrukhabad: "फर्रुखाबाद",
        Fatehpur: "फतेहपुर",
        Firozabad: "फिरोजाबाद",
        "Gautam Buddha Nagar": "गौतम बुद्ध नगर",
        Ghaziabad: "गाजियाबाद",
        Ghazipur: "गाजीपुर",
        Gonda: "गोंडा",
        Gorakhpur: "गोरखपुर",
        Hamirpur: "हमीरपुर",
        Hapur: "हापुड़",
        Hardoi: "हरदोई",
        Hathras: "हाथरस",
        Jalaun: "जालौन",
        Jaunpur: "जौनपुर",
        Jhansi: "झांसी",
        Kannauj: "कन्नौज",
        "Kanpur Dehat": "कानपुर देहात",
        "Kanpur Nagar": "कानपुर नगर",
        Kasganj: "कासगंज",
        Kaushambi: "कौशाम्बी",
        Kushinagar: "कुशीनगर",
        "Lakhimpur Kheri": "लखीमपुर खीरी",
        Lalitpur: "ललितपुर",
        Lucknow: "लखनऊ",
        Maharajganj: "महाराजगंज",
        Mahoba: "महोबा",
        Mainpuri: "मैनपुरी",
        Mathura: "मथुरा",
        Mau: "मऊ",
        Meerut: "मेरठ",
        Mirzapur: "मिर्जापुर",
        Moradabad: "मुरादाबाद",
        Muzaffarnagar: "मुजफ्फरनगर",
        Pilibhit: "पीलीभीत",
        Pratapgarh: "प्रतापगढ़",
        Raebareli: "रायबरेली",
        Rampur: "रामपुर",
        Saharanpur: "सहारनपुर",
        Sambhal: "सम्भल",
        "Sant Kabir Nagar": "संत कबीर नगर",
        Shahjahanpur: "शाहजहांपुर",
        Shamli: "शामली",
        Shravasti: "श्रावस्ती",
        Siddharthnagar: "सिद्धार्थनगर",
        Sitapur: "सीतापुर",
        Sonbhadra: "सोनभद्र",
        Sultanpur: "सुल्तानपुर",
        Unnao: "उन्नाव",
        Varanasi: "वाराणसी",
      },
    },
  },
  gu: {
    language_name: "ગુજરાતી",
    nav_home: "હોમ",
    nav_how_it_works: "તે કેવી રીતે કામ કરે છે",
    nav_features: "સુવિધાઓ",
    nav_faq: "વારંવાર પૂછાતા પ્રશ્નો",
    nav_team: "ટીમ",
    nav_contact: "સંપર્ક",
    nav_gemini_qa: "જેમિની Q&A",
    nav_login: "લોગિન",
    nav_register: "રજીસ્ટર કરો",
    hero_title_1: "AI-સંચાલિત પાક ઉપજ",
    hero_title_2: "આગાહી અને ઓપ્ટિમાઇઝેશન",
    hero_subtitle:
      "વધુ સ્માર્ટ ખેતીના નિર્ણયો લેવા માટે વાસ્તવિક-સમયના હવામાન, જમીનના ડેટા અને બજારના ભાવોનો લાભ લો.",
    hero_get_started: "શરૂ કરો",
    form_crop_name: "પાકનું નામ",
    form_area: "વિસ્તાર (એકર)",
    form_planting_date: "વાવેતરની તારીખ",
    form_state: "રાજ્ય",
    form_select_state: "રાજ્ય પસંદ કરો",
    form_district: "જિલ્લો",
    form_select_district: "જિલ્લો પસંદ કરો",
    form_soil_type: "જમીનનો પ્રકાર",
    form_soil_ph: "જમીનનો pH",
    form_predict_button: "ઉપજની આગાહી કરો અને ભલામણો મેળવો",
    prediction_card_title: "તમારી આગાહી શરૂ કરો",
    prediction_card_desc:
      "અમારું AI-સંચાલિત સાધન તમારા ખેતરની અનન્ય પરિસ્થિતિઓનું વિશ્લેષણ કરે છે—જમીનના પ્રકાર અને સ્થાનિક હવામાન પેટર્નથી લઈને બજારના વલણો સુધી—અને તમને અનુકૂળ ઉપજની આગાહીઓ અને પાકની ભલામણો પૂરી પાડે છે. તમારી લણણીને શ્રેષ્ઠ બનાવવા અને નફાકારકતા વધારવા માટે જરૂરી આંતરદૃષ્ટિ મેળવો.",
    prediction_card_button: "હવે શરૂ કરો",
    loading_text:
      "ડેટાનું વિશ્લેષણ, જીવંત હવામાન મેળવી રહ્યું છે, અને આગાહીઓ બનાવી રહ્યું છે...",
    alert_fill_fields: "કૃપા કરીને બધા જરૂરી ક્ષેત્રો ભરો.",
    alert_no_coords: "પસંદ કરેલ જિલ્લા માટે કોઓર્ડિનેટ્સ મળી શક્યા નથી.",
    alert_select_state_district: "કૃપા કરીને પહેલા રાજ્ય અને જિલ્લો પસંદ કરો.",
    alert_weather_fail:
      "જીવંત હવામાન ડેટા મેળવવામાં નિષ્ફળ. કૃપા કરીને પછીથી ફરી પ્રયાસ કરો.",
    results_analysis_for: "{district} માં {crop} માટે વિશ્લેષણ",
    results_expected_yield: "અપેક્ષિત ઉપજ",
    results_tonnes: "ટન",
    results_harvest_window: "લણણીનો સમયગાળો",
    results_to: "થી",
    results_weather_now: "હાલનું હવામાન",
    results_soil_details: "જમીનની વિગતો",
    card_crop_recs: "શ્રેષ્ઠ પાક ભલામણો",
    card_crop_recs_subtitle:
      "તમારા સ્થાનની આબોહવા, જમીન અને પસંદ કરેલ વાવેતરની મોસમ ({season}) પર આધારિત.",
    card_suitability_score: "અનુરૂપતા સ્કોર (6 માંથી)",
    card_top_5_crops: "ટોચના 5 ભલામણ કરેલ પાક",
    card_no_recs: "આપેલ શરતો માટે યોગ્ય પાકની ભલામણો મળી નથી.",
    card_disclaimer:
      "અસ્વીકરણ: આ સાર્વજનિક ડેટાસેટ પર આધારિત સ્વચાલિત માર્ગદર્શન છે. અંતિમ નિર્ણયો માટે સ્થાનિક નિષ્ણાતોની સલાહ લો.",
    card_financials: "નાણાકીય અંદાજો",
    card_market_price: "બજાર ભાવ (₹ પ્રતિ ક્વિન્ટલ)",
    card_total_cost: "કુલ ખર્ચ",
    card_total_revenue: "કુલ આવક",
    card_estimated_profit: "અંદાજિત નફો",
    card_profitability_breakdown: "નફાકારકતાનું વિશ્લેષણ",
    card_market_trends: "બજાર ભાવના વલણો (છેલ્લા 30 દિવસ)",
    card_price_per_quintal: "ભાવ પ્રતિ ક્વિન્ટલ (₹)",
    card_market_trends_min: "ન્યૂનતમ ભાવ",
    card_market_trends_modal: "મોડલ ભાવ",
    card_market_trends_max: "મહત્તમ ભાવ",
    card_historical_weather: "ઐતિહાસિક હવામાન (છેલ્લું વર્ષ)",
    card_temp_humidity: "તાપમાન અને ભેજ",
    card_weekly_forecast: "7-દિવસીય હવામાન આગાહી",
    planting_suitability_title: "વાવેતર યોગ્યતા (આગામી 3 દિવસ)",
    planting_suitable_true: "વાવેતર માટે સારું",
    planting_suitable_false: "વાવેતર માટે આદર્શ નથી",
    reason_temp_high: "સરેરાશ તાપમાન ખૂબ ઊંચું",
    reason_temp_low: "સરેરાશ તાપમાન ખૂબ ઓછું",
    reason_humidity_high: "સરેરાશ ભેજ ખૂબ ઊંચો",
    reason_humidity_low: "સરેરાશ ભેજ ખૂબ ઓછો",
    how_it_works_title: "તે કેવી રીતે કામ કરે છે",
    how_it_works_p1:
      "અમારું પ્લેટફોર્મ જટિલ કૃષિ આયોજનને એક સરળ, પગલા-દર-પગલા પ્રક્રિયામાં સરળ બનાવે છે. તમારા ઇનપુટથી તમારી વ્યક્તિગત ઉપજની આગાહી સુધીની ડેટા યાત્રાનું વિવરણ અહીં છે:",
    how_it_works_l1:
      "વપરાશકર્તા ઇનપુટ્સ: તમે મુખ્ય વિગતો પ્રદાન કરો છો: પાક, સ્થાન, વિસ્તાર, જમીન અને વાવેતરની તારીખ.",
    how_it_works_l2:
      "ભૌગોલિક અને જમીન ડેટા: અમે તમારા જિલ્લાને કોઓર્ડિનેટ્સમાં રૂપાંતરિત કરીએ છીએ અને વૈશ્વિક ડેટાબેઝમાંથી સ્થાનિક જમીન ડેટા મેળવીએ છીએ.",
    how_it_works_l3:
      "હવામાન ડેટા મેળવો: અમે તમારા વિશિષ્ટ સ્થાન માટે વાસ્તવિક-સમયના આગાહીઓ અને ઐતિહાસિક આબોહવા ડેટા મેળવીએ છીએ.",
    how_it_works_l4:
      "પાકની ભલામણ: સિસ્ટમ તમારી સ્થાનિક પરિસ્થિતિઓનું વિશ્લેષણ કરીને સૌથી યોગ્ય પાકોની ભલામણ કરે છે.",
    how_it_works_l5:
      "AI-આધારિત ઉપજ ગણતરી: અમારું મોડેલ એક સુધારેલી આગાહી બનાવવા માટે ઐતિહાસિક હવામાન, જમીનના પ્રકાર અને અન્ય પરિબળોનો ઉપયોગ કરીને આધારરેખા ઉપજને સમાયોજિત કરે છે.",
    how_it_works_l6:
      "બજાર ભાવ વિશ્લેષણ: અમે સંભવિત આવકને સમજવામાં તમારી મદદ કરવા માટે ભાવના વલણો મેળવવાનું અનુકરણ કરીએ છીએ.",
    how_it_works_l7:
      "ડેટા વિઝ્યુલાઇઝેશન: બધો પ્રક્રિયા કરેલો ડેટા સમજવામાં સરળ ચાર્ટમાં રજૂ કરવામાં આવે છે.",
    features_title: "પ્લેટફોર્મ સુવિધાઓ",
    features_f1_title: "AI ઉપજ આગાહી",
    features_f1_text:
      "અદ્યતન મોડેલો જે વધુ સચોટ ઉપજની આગાહી આપવા માટે આધારરેખા સરેરાશથી આગળ વધે છે.",
    features_f2_title: "ડેટા-આધારિત ભલામણો",
    features_f2_text:
      "તમારા સ્થાનની મોસમ, જમીનના પ્રકાર અને આબોહવા ડેટાના આધારે સૌથી યોગ્ય પાકો સૂચવે છે.",
    features_f3_title: "જીવંત હવામાન અને આગાહીઓ",
    features_f3_text:
      "વાસ્તવિક-સમયના તાપમાન અને ભેજની રીડિંગ્સ, ઉપરાંત વિગતવાર આગાહીઓ મેળવો.",
    features_f4_title: "ઐતિહાસિક આબોહવા વિશ્લેષણ",
    features_f4_text:
      "તમારા વિસ્તારમાં લાંબા ગાળાના હવામાનની પેટર્નને સમજે છે જેથી આગાહીઓને વધુ સારી રીતે જાણ કરી શકાય.",
    features_f5_title: "ઇન્ટરેક્ટિવ વિઝ્યુલાઇઝેશન્સ",
    features_f5_text:
      "ઐતિહાસિક હવામાન, બજારના ભાવો અને પાકની યોગ્યતા માટે પ્રતિભાવશીલ ચાર્ટ્સ સાથેના વલણોનું વિશ્લેષણ કરો.",
    features_f6_title: "જેમિની-સંચાલિત Q&A",
    features_f6_text:
      "કૃષિ વિષયો પર ત્વરિત આંતરદૃષ્ટિ માટે અમારા સંકલિત AI સહાયકને પૂછો.",
    features_note_title: "કૃપયા નોંધો:",
    features_note_text:
      "આ પ્લેટફોર્મ એક પ્રોટોટાઇપ છે. ઉપજની આગાહીઓ આંકડાકીય મોડેલો અને સાર્વજનિક ડેટા પર આધારિત છે, અને તેનો ઉપયોગ માર્ગદર્શન તરીકે થવો જોઈએ, ગેરંટી તરીકે નહીં. હંમેશા સ્થાનિક કૃષિ નિષ્ણાતો સાથે સલાહ લો.",
    faq_title: "વારંવાર પૂછાતા પ્રશ્નો",
    faq_q1_title: "ડેટા કેટલી વાર તાજું કરવામાં આવે છે?",
    faq_q1_text:
      "તમારી વિનંતી પર વર્તમાન હવામાન ડેટા વાસ્તવિક સમયમાં મેળવવામાં આવે છે. બજાર ભાવ ડેટાનું દૈનિક અનુકરણ કરવામાં આવે છે. ઐતિહાસિક ડેટાસેટ્સ સમયાંતરે અપડેટ કરવામાં આવે છે.",
    faq_q2_title: "ઉપજની આગાહીની મર્યાદાઓ શું છે?",
    faq_q2_text:
      "અમારું મોડેલ આધારરેખા ઉપજને સુધારવા માટે ઐતિહાસિક હવામાન અને જમીન ડેટાનો ઉપયોગ કરે છે. તે એક શક્તિશાળી અંદાજ સાધન છે પરંતુ હજુ સુધી બીજની ગુણવત્તા, જંતુનો ઉપદ્રવ, અથવા વધતી મોસમ દરમિયાન વિશિષ્ટ હવામાન ઘટનાઓ જેવા સૂક્ષ્મ-ચલોનો હિસાબ કરતું નથી.",
    faq_q3_title: "API કી કેવી રીતે સંભાળવામાં આવે છે?",
    faq_q3_text:
      "આ પ્રોટોટાઇપમાં, API કી પ્રદર્શન માટે બ્રાઉઝરમાં સંચાલિત થાય છે. ઉત્પાદન જમાવટમાં, બધી API કી સર્વર પર સુરક્ષિત પર્યાવરણ ચલો તરીકે સંગ્રહિત થવી જોઈએ, અને કૉલ્સને બેકએન્ડ દ્વારા રૂટ કરવામાં આવશે.",
    faq_q4_title: "બજાર ભાવ ડેટા ક્યાંથી આવે છે?",
    faq_q4_text:
      "હાલમાં, બજાર ડેટાનું વાસ્તવિક રીતે અનુકરણ કરવામાં આવે છે. અમારી સિસ્ટમ બેકએન્ડ સેવાઓ સાથે જોડાવા માટે બનાવવામાં આવી છે જે જીવંત ભાવો માટે AGMARKNET અને e-NAM જેવા સત્તાવાર સરકારી સ્ત્રોતો પાસેથી પૂછપરછ કરશે.",
    team_title: "અમારી ટીમ",
    team_subtitle:
      "અમે કૃષિવિજ્ઞાનીઓ, ઇજનેરો અને ડિઝાઇનરોની એક સમર્પિત ટીમ છીએ જે ટકાઉ અને નફાકારક કૃષિને ટેકો આપતા સાધનો બનાવવા માટે પ્રતિબદ્ધ છીએ.",
    contact_title: "અમારો સંપર્ક કરો",
    contact_subtitle:
      "કોઈ પ્રશ્ન, પ્રતિસાદ, અથવા ભાગીદારીની પૂછપરછ છે? અમને તમારી પાસેથી સાંભળવામાં ગમશે.",
    contact_name: "પૂરું નામ",
    contact_email: "ઇમેઇલ સરનામું",
    contact_message: "સંદેશ",
    contact_send: "સંદેશ મોકલો",
    contact_alert:
      "સંદેશ મોકલ્યો! અમે 2-3 વ્યવસાયિક દિવસોમાં તમારો સંપર્ક કરીશું.",
    login_page_title: "તમારા એકાઉન્ટમાં લોગિન કરો",
    login_email: "ઇમેઇલ સરનામું",
    login_password: "પાસવર્ડ",
    login_button: "લોગિન",
    login_forgot_password: "પાસવર્ડ ભૂલી ગયા છો?",
    login_no_account: "એકાઉન્ટ નથી?",
    login_signup_link: "સાઇન અપ કરો",
    register_page_title: "એકાઉન્ટ બનાવો",
    register_name: "પૂરું નામ",
    register_email: "ઇમેઇલ સરનામું",
    register_password: "પાસવર્ડ",
    register_confirm_password: "પાસવર્ડની પુષ્ટિ કરો",
    register_button: "રજીસ્ટર કરો",
    register_has_account: "પહેલેથી જ એકાઉન્ટ છે?",
    register_login_link: "લોગિન",
    gemini_title: "હરિયાળીને પૂછો",
    gemini_subtitle: "તમારો AI કૃષિ સહાયક",
    gemini_placeholder: "પાક, જમીન, અથવા બજારના ભાવો વિશે પૂછો...",
    gemini_welcome:
      "નમસ્તે! હું હરિયાળી છું, તમારો AI કૃષિ સહાયક. આજે હું તમારા ખેતીના પ્રશ્નોમાં તમારી કેવી રીતે મદદ કરી શકું?",
    gemini_error:
      "એક ભૂલ આવી: {error}. કૃપા કરીને ખાતરી કરો કે API કી યોગ્ય રીતે ગોઠવેલ છે.",
    gemini_no_response: "મને માફ કરશો, હું કોઈ જવાબ આપી શક્યો નથી.",
    card_management_recs: "પાક સંચાલન",
    card_no_management_data: "આ પાક માટે સંચાલન ભલામણો હજુ ઉપલબ્ધ નથી.",
    management_fertilizer_title: "પોષક તત્વ વ્યવસ્થાપન",
    management_pest_title: "જીવાત અને રોગ નિયંત્રણ",
    management_bajra_fert_rec_1:
      "વરસાદ આધારિત NPK ગુણોત્તર: 40:20:20 કિગ્રા/હેક્ટર.",
    management_bajra_fert_rec_2: "પિયત NPK ગુણોત્તર: 60:30:30 કિગ્રા/હેક્ટર.",
    management_bajra_fert_rec_3:
      "અડધો નાઇટ્રોજન અને સંપૂર્ણ ફોસ્ફરસ અને પોટેશિયમ પાયાના ડોઝ તરીકે આપો. બાકીનો N વાવણીના 30 દિવસ પછી આપો.",
    management_bajra_fert_rec_4:
      "જસતની ઉણપવાળી જમીનમાં, વાવણી વખતે 10 કિગ્રા/હેક્ટર ઝીંક સલ્ફેટ આપો.",
    management_bajra_pest_1_name: "ગાભમારો",
    management_bajra_pest_1_control:
      "ઇમિડાક્લોપ્રિડ 70 WS થી બીજની માવજત કરો. સમયસર વાવણી ઉપદ્રવથી બચવામાં મદદ કરે છે.",
    management_bajra_pest_2_name: "થડનો કીડો",
    management_bajra_pest_2_control:
      "કાર્બેરિલ 50 WP અથવા ડાયમેથોએટ 30 EC નો છંટકાવ કરો.",
    management_bajra_pest_3_name: "ડાઉની મિલ્ડ્યુ",
    management_bajra_pest_3_control:
      "પ્રતિકારક જાતોનો ઉપયોગ કરો. મેટાલેક્સિલથી બીજની માવજત કરો. મેટાલેક્સિલ + મેન્કોઝેબનો છંટકાવ કરો.",
    management_banana_fert_rec_1:
      "ઉચ્ચ પોષક તત્વોની જરૂરિયાત: 200-300 ગ્રામ N, 60-90 ગ્રામ P, 300-400 ગ્રામ K પ્રતિ છોડ પ્રતિ વર્ષ.",
    management_banana_fert_rec_2:
      "શ્રેષ્ઠ પરિણામો માટે ફર્ટિગેશન દ્વારા 5-6 વિભાજીત ડોઝમાં પોષક તત્વો આપો.",
    management_banana_fert_rec_3:
      "વાવેતર સમયે પ્રતિ છોડ 10-15 કિલો ફાર્મ યાર્ડ મેન્યુર (FYM) આપો.",
    management_banana_fert_rec_4:
      "સૂક્ષ્મ પોષકતત્વો (ઝીંક, બોરોન) નો છંટકાવ ફળના વિકાસ માટે ફાયદાકારક છે.",
    management_banana_pest_1_name: "રાઇઝોમ વીવીલ",
    management_banana_pest_1_control:
      "તંદુરસ્ત, જીવાત મુક્ત સકરનો ઉપયોગ કરો. છોડના પાયાની આસપાસ કાર્બોફ્યુરાન 3G દાણાદાર નાખો.",
    management_banana_pest_2_name: "સ્યુડોસ્ટેમ બોરર",
    management_banana_pest_2_control:
      "વાવેતર સ્વચ્છ રાખો. થડમાં મોનોક્રોટોફોસ 36 SL ઇન્જેક્ટ કરો.",
    management_banana_pest_3_name: "પનામા વિલ્ટ",
    management_banana_pest_3_control:
      "પ્રતિકારક જાતો (દા.ત., G-9) નો ઉપયોગ કરો. જમીનનો નિકાલ સુધારો. જમીનને કાર્બેન્ડાઝીમથી પલાળો.",
    management_barley_fert_rec_1: "પિયત NPK ગુણોત્તર: 60:30:20 કિગ્રા/હેક્ટર.",
    management_barley_fert_rec_2:
      "વરસાદ આધારિત NPK ગુણોત્તર: 40:20:10 કિગ્રા/હેક્ટર.",
    management_barley_fert_rec_3:
      "વાવણી વખતે અડધો N + સંપૂર્ણ P અને K આપો. પ્રથમ પિયત વખતે બાકીનો N ટોપ ડ્રેસ કરો.",
    management_barley_fert_rec_4:
      "સલ્ફરની ઉણપવાળી જમીનમાં 20 કિગ્રા/હેક્ટર સલ્ફર આપો.",
    management_barley_pest_1_name: "એફિડ્સ",
    management_barley_pest_1_control:
      "જો ઉપદ્રવ વધુ હોય તો ડાયમેથોએટ 30 EC અથવા ઇમિડાક્લોપ્રિડ 17.8 SL નો છંટકાવ કરો.",
    management_barley_pest_2_name: "પીળો ગેરુ",
    management_barley_pest_2_control:
      "પ્રતિકારક જાતો વાવો. પ્રોપિકોનાઝોલ અથવા ટેબુકોનાઝોલનો છંટકાવ કરો.",
    management_barley_pest_3_name: "લૂઝ સ્મટ",
    management_barley_pest_3_control:
      "વાવણી પહેલાં બીજને વિટાવાક્સ અથવા કાર્બોક્સિનથી માવજત કરો.",
    management_chilli_fert_rec_1:
      "સામાન્ય NPK ગુણોત્તર: 120:60:80 કિગ્રા/હેક્ટર.",
    management_chilli_fert_rec_2:
      "25 ટન/હેક્ટરના દરે FYM આપો. અડધો N + સંપૂર્ણ P અને K પાયામાં આપો. બાકીનો N 2 ભાગમાં ટોપ ડ્રેસ કરો.",
    management_chilli_fert_rec_3:
      "ફૂલ આવવાના અને ફળ બેસવાના તબક્કે પાણીમાં દ્રાવ્ય ખાતરોનો છંટકાવ ઉપજમાં સુધારો કરે છે.",
    management_chilli_pest_1_name: "થ્રિપ્સ અને માઇટ્સ",
    management_chilli_pest_1_control:
      "ફિપ્રોનિલ 5 SC અથવા સ્પાઇરોમેસિફેન 22.9 SC નો છંટકાવ કરો. નિરીક્ષણ માટે પીળા સ્ટીકી ટ્રેપ્સ.",
    management_chilli_pest_2_name: "ફળ કોરી ખાનાર",
    management_chilli_pest_2_control:
      "ઇમામેક્ટીન બેન્ઝોએટ 5 SG અથવા ક્લોરેન્ટ્રાનિલિપ્રોલ 18.5 SC નો છંટકાવ કરો.",
    management_chilli_pest_3_name: "એન્થ્રેકનોઝ અને પાઉડરી મિલ્ડ્યુ",
    management_chilli_pest_3_control:
      "એન્થ્રેકનોઝ માટે મેન્કોઝેબ અને પાઉડરી મિલ્ડ્યુ માટે વેટેબલ સલ્ફરનો છંટકાવ કરો.",
    management_coconut_fert_rec_1:
      "પ્રતિ પામ પ્રતિ વર્ષ 500 ગ્રામ N, 320 ગ્રામ P2O5, 1200 ગ્રામ K2O બે સમાન ભાગમાં (ચોમાસા પહેલા અને પછી) આપો.",
    management_coconut_fert_rec_2:
      "પ્રતિ પામ પ્રતિ વર્ષ 25-50 કિલો ઓર્ગેનિક ખાતર (FYM અથવા કમ્પોસ્ટ) આપો.",
    management_coconut_fert_rec_3:
      "પામની આસપાસ 1.8 મીટર ત્રિજ્યાના ગોળાકાર તટપ્રદેશમાં ખાતર આપો.",
    management_coconut_fert_rec_4:
      "સામાન્ય મીઠું (1 કિલો/પામ) અખરોટનું કદ અને ઉપજ સુધારી શકે છે.",
    management_coconut_pest_1_name: "ગેંડો ભમરો",
    management_coconut_pest_1_control:
      "તાજની સફાઈ. ફેરોમોન ટ્રેપ્સનો ઉપયોગ કરો. પાંદડાની કક્ષમાં નેપ્થાલિન બોલ સાથે મિશ્રિત રેતી મૂકો.",
    management_coconut_pest_2_name: "લાલ પામ વીવીલ",
    management_coconut_pest_2_control:
      "પામને ઇજાઓ ટાળો. ઇમિડાક્લોપ્રિડ સાથે સ્ટેમ ઇન્જેક્શન.",
    management_coconut_pest_3_name: "બડ રોટ",
    management_coconut_pest_3_control:
      "અસરગ્રસ્ત પેશીઓને કાપીને દૂર કરો. તાજને 1% બોર્ડેક્સ મિશ્રણથી પલાળો.",
    management_cotton_fert_rec_1: "પિયત NPK ગુણોત્તર: 100:50:50 કિગ્રા/હેક્ટર.",
    management_cotton_fert_rec_2:
      "વરસાદ આધારિત NPK ગુણોત્તર: 80:40:40 કિગ્રા/હેક્ટર.",
    management_cotton_fert_rec_3:
      "નાઇટ્રોજનને 2-3 ભાગમાં આપો; સંપૂર્ણ ફોસ્ફરસ અને પોટેશિયમ પાયાના ડોઝ તરીકે આપો.",
    management_cotton_fert_rec_4:
      "ફૂલ આવવાના સમયે 2% DAPનો છંટકાવ બોલના વિકાસને વેગ આપે છે.",
    management_cotton_fert_rec_5:
      "પોષક તત્વોના શોષણને સુધારવા માટે જૈવિક ખાતરો (એઝોટોબેક્ટર, પીએસબી)નો ઉપયોગ કરો.",
    management_cotton_pest_1_name: "ઇયળો (ગુલાબી, અમેરિકન)",
    management_cotton_pest_1_control:
      "નિરીક્ષણ માટે ફેરોમોન ટ્રેપ (4-5/એકર) નો ઉપયોગ કરો. જો ઉપદ્રવ ETLને પાર કરે તો ઇમામેક્ટીન બેન્ઝોએટ 5 SG અથવા ક્લોરેન્ટ્રાનિલિપ્રોલ 18.5 SC નો છંટકાવ કરો.",
    management_cotton_pest_2_name: "ચૂસિયાં જીવાતો (એફિડ, જેસિડ, સફેદ માખી)",
    management_cotton_pest_2_control:
      "ઇમિડાક્લોપ્રિડ 17.8 SL અથવા એસેટામિપ્રિડ 20 SP જેવી પ્રણાલીગત જંતુનાશકોનો છંટકાવ કરો. લીમડાનું તેલ (1500 ppm) એક અસરકારક ઓર્ગેનિક વિકલ્પ છે.",
    management_ginger_fert_rec_1: "25-30 ટન/હેક્ટર FYM નો પાયાનો ડોઝ.",
    management_ginger_fert_rec_2: "NPK ગુણોત્તર: 75:50:50 કિગ્રા/હેક્ટર.",
    management_ginger_fert_rec_3:
      "વાવેતર વખતે સંપૂર્ણ P અને અડધો K આપો. વાવેતરના 45 અને 90 દિવસે બે ભાગમાં N અને બાકીનો K આપો.",
    management_ginger_fert_rec_4:
      "ભેજનું સંરક્ષણ અને નીંદણ નિયંત્રણ માટે વાવેતર પછી મલ્ચિંગ જરૂરી છે.",
    management_ginger_pest_1_name: "શૂટ બોરર",
    management_ginger_pest_1_control:
      "ડાયમેથોએટ 30 EC અથવા ક્વિનાલફોસ 25 EC નો છંટકાવ કરો.",
    management_ginger_pest_2_name: "સોફ્ટ રોટ",
    management_ginger_pest_2_control:
      "સારી ડ્રેનેજની ખાતરી કરો. બીજ રાઇઝોમને મેન્કોઝેબ દ્રાવણથી માવજત કરો. જમીનને મેટાલેક્સિલથી પલાળો.",
    management_gram_fert_rec_1:
      "NPK ગુણોત્તર: 20:60:20 કિગ્રા/હેક્ટર. બધા પાયાના ડોઝ તરીકે આપો.",
    management_gram_fert_rec_2:
      "નાઇટ્રોજન ફિક્સેશન વધારવા માટે વાવણી પહેલાં બીજને રાઇઝોબિયમ કલ્ચરથી માવજત કરો.",
    management_gram_fert_rec_3:
      "20 કિગ્રા/હેક્ટર સલ્ફરનો ઉપયોગ ફાયદાકારક છે, ખાસ કરીને તેલીબિયાં ઉગાડતા વિસ્તારોમાં.",
    management_gram_pest_1_name: "પોડ બોરર (હેલિકોવરપા)",
    management_gram_pest_1_control:
      "ફેરોમોન ટ્રેપ્સ ઇન્સ્ટોલ કરો. પ્રથમ લીમડાના બીજના અર્ક (NSKE) 5% સાથે છંટકાવ કરો. જો જરૂર હોય તો, ઇમામેક્ટીન બેન્ઝોએટ 5 SG સાથે છંટકાવ કરો.",
    management_gram_pest_2_name: "ફ્યુઝેરિયમ વિલ્ટ",
    management_gram_pest_2_control:
      "પ્રતિકારક જાતોનો ઉપયોગ કરો. ટ્રાઇકોડર્મા વિરાઇડ સાથે બીજની સારવાર. ઊંડી ઉનાળાની ખેડ.",
    management_grapes_fert_rec_1:
      "ખાતરનું સમયપત્રક વૃદ્ધિના તબક્કા પર આધાર રાખે છે (કાપણી, ફૂલો, ફળ સમૂહ પછી).",
    management_grapes_fert_rec_2:
      "પુખ્ત વેલા (4 વર્ષ પછી) ને વિભાજીત ડોઝમાં પ્રતિ વેલો પ્રતિ વર્ષ 500:500:1000g NPK ની જરૂર પડી શકે છે.",
    management_grapes_fert_rec_3: "પ્રતિ વેલો પ્રતિ વર્ષ 20-30 કિલો FYM આપો.",
    management_grapes_fert_rec_4:
      "કાર્યક્ષમ પોષક તત્વોના વિતરણ માટે ફર્ટિગેશનનો ઉપયોગ કરો.",
    management_grapes_pest_1_name: "મીલીબગ્સ",
    management_grapes_pest_1_control:
      "બુપ્રોફેઝિન 25 SC અથવા ઇમિડાક્લોપ્રિડ 17.8 SL સાથે છંટકાવ કરો.",
    management_grapes_pest_2_name: "ડાઉની અને પાઉડરી મિલ્ડ્યુ",
    management_grapes_pest_2_control:
      "પ્રોફીલેક્ટિક સ્પ્રે નિર્ણાયક છે. ડાઉની મિલ્ડ્યુ માટે મેન્કોઝેબ અને પાઉડરી મિલ્ડ્યુ માટે સલ્ફર/હેક્સાકોનાઝોલનો ઉપયોગ કરો.",
    management_groundnut_fert_rec_1:
      "વરસાદ આધારિત NPK ગુણોત્તર: 20:40:40 કિગ્રા/હેક્ટર.",
    management_groundnut_fert_rec_2:
      "પિયત NPK ગુણોત્તર: 25:50:75 કિગ્રા/હેક્ટર.",
    management_groundnut_fert_rec_3:
      "વધુ સારી શીંગોના વિકાસ માટે ફૂલો દરમિયાન 250 કિગ્રા/હેક્ટર જીપ્સમ આપો.",
    management_groundnut_fert_rec_4:
      "રાઇઝોબિયમ સાથે બીજની માવજત કરવાની ભલામણ કરવામાં આવે છે.",
    management_groundnut_pest_1_name: "લીફ માઇનર",
    management_groundnut_pest_1_control:
      "ડાયમેથોએટ 30 EC અથવા ક્વિનાલફોસ 25 EC સાથે છંટકાવ કરો.",
    management_groundnut_pest_2_name: "ટિક્કા લીફ સ્પોટ",
    management_groundnut_pest_2_control:
      "કાર્બેન્ડાઝીમ + મેન્કોઝેબ અથવા ક્લોરોથાલોનિલ 75 WP સાથે છંટકાવ કરો.",
    management_jowar_fert_rec_1: "પિયત NPK ગુણોત્તર: 80:40:40 કિગ્રા/હેક્ટર.",
    management_jowar_fert_rec_2:
      "વરસાદ આધારિત NPK ગુણોત્તર: 40:20:20 કિગ્રા/હેક્ટર.",
    management_jowar_fert_rec_3:
      "અડધો N અને સંપૂર્ણ P અને K પાયાના ડોઝ તરીકે આપો. વાવણીના 30-35 દિવસ પછી બાકીનો N ટોપ ડ્રેસ કરો.",
    management_jowar_pest_1_name: "શૂટ ફ્લાય",
    management_jowar_pest_1_control:
      "ઇમિડાક્લોપ્રિડ સાથે બીજની માવજત. વહેલી વાવણી ઉપદ્રવ ઘટાડી શકે છે.",
    management_jowar_pest_2_name: "સ્ટેમ બોરર",
    management_jowar_pest_2_control:
      "વાવણીના 20-25 દિવસ પછી વમળમાં કાર્બોફ્યુરાન 3G દાણાદાર નાખો.",
    management_jute_fert_rec_1:
      "ઓલિટોરિયસ શણ માટે NPK ગુણોત્તર: 40:20:20 કિગ્રા/હેક્ટર.",
    management_jute_fert_rec_2:
      "કેપ્સુલરિસ શણ માટે NPK ગુણોત્તર: 60:30:30 કિગ્રા/હેક્ટર.",
    management_jute_fert_rec_3:
      "N ને બે ભાગમાં આપો: અડધો પાયા તરીકે, અડધો વાવણીના 3-4 અઠવાડિયા પછી.",
    management_jute_fert_rec_4: "જમીનની તૈયારી દરમિયાન 5-7 ટન/હેક્ટર FYM આપો.",
    management_jute_pest_1_name: "જૂટ સેમિલૂપર",
    management_jute_pest_1_control:
      "ક્લોરપાયરીફોસ 20 EC અથવા ક્વિનાલફોસ 25 EC સાથે છંટકાવ કરો.",
    management_jute_pest_2_name: "સ્ટેમ રોટ",
    management_jute_pest_2_control:
      "ડ્રેનેજ સુધારો. કાર્બેન્ડાઝીમ સાથે બીજની માવજત. પાકની ફેરબદલી.",
    management_lentil_fert_rec_1:
      "NPK ગુણોત્તર: 20:40:20 કિગ્રા/હેક્ટર. બધા પાયાના ડોઝ તરીકે આપો.",
    management_lentil_fert_rec_2: "રાઇઝોબિયમ કલ્ચર સાથે બીજની માવજત કરો.",
    management_lentil_fert_rec_3:
      "20 કિગ્રા/હેક્ટર સલ્ફરનો ઉપયોગ ઉપજ અને પ્રોટીન સામગ્રીમાં વધારો કરી શકે છે.",
    management_lentil_pest_1_name: "એફિડ્સ",
    management_lentil_pest_1_control:
      "ડાયમેથોએટ 30 EC અથવા ઇમિડાક્લોપ્રિડ 17.8 SL સાથે છંટકાવ કરો.",
    management_lentil_pest_2_name: "રસ્ટ અને વિલ્ટ",
    management_lentil_pest_2_control:
      "પ્રતિકારક જાતોનો ઉપયોગ કરો. થિરામ + કાર્બેન્ડાઝીમ સાથે બીજની માવજત.",
    management_maize_fert_rec_1:
      "હાઇબ્રિડ મકાઈ NPK ગુણોત્તર: 120:60:60 કિગ્રા/હેક્ટર.",
    management_maize_fert_rec_2:
      "વાવણી વખતે 1/3 N અને સંપૂર્ણ P અને K આપો. બાકીનો N બે ભાગમાં આપો: ઘૂંટણ-ઉચ્ચ તબક્કે અને ટેસેલિંગ વખતે.",
    management_maize_fert_rec_3:
      "જસતની ઉણપવાળી જમીનમાં 25 કિગ્રા/હેક્ટર ઝીંક સલ્ફેટ આપો.",
    management_maize_pest_1_name: "ફોલ આર્મીવોર્મ",
    management_maize_pest_1_control:
      "ફેરોમોન ટ્રેપ્સ ઇન્સ્ટોલ કરો. વમળમાં ઇમામેક્ટીન બેન્ઝોએટ 5 SG આપો.",
    management_maize_pest_2_name: "સ્ટેમ બોરર",
    management_maize_pest_2_control: "વમળમાં કાર્બોફ્યુરાન 3G દાણાદાર નાખો.",
    management_mango_fert_rec_1:
      "ખાતરની માત્રા ઉંમર પ્રમાણે બદલાય છે. 10 વર્ષ જૂના વૃક્ષને પ્રતિ વર્ષ લગભગ 1 કિલો N, 0.5 કિલો P, 1 કિલો K ની જરૂર પડે છે.",
    management_mango_fert_rec_2:
      "લણણી પછી અને ચોમાસા દરમિયાન બે ભાગમાં ઓર્ગેનિક ખાતર (50-100 કિલો/વૃક્ષ) અને ખાતરો આપો.",
    management_mango_fert_rec_3:
      "વૃક્ષની છત્રની આસપાસ ગોળાકાર ખાઈમાં અરજી કરો.",
    management_mango_pest_1_name: "કેરી હોપર",
    management_mango_pest_1_control:
      "ફૂલો દરમિયાન ઇમિડાક્લોપ્રિડ 17.8 SL અથવા થાઇમેથોક્સમ 25 WG સાથે છંટકાવ કરો.",
    management_mango_pest_2_name: "પાઉડરી મિલ્ડ્યુ અને એન્થ્રેકનોઝ",
    management_mango_pest_2_control:
      "મિલ્ડ્યુ માટે વેટેબલ સલ્ફર અને એન્થ્રેકનોઝ માટે કાર્બેન્ડાઝીમનો છંટકાવ કરો.",
    management_millet_fert_rec_1:
      "નાના બાજરી માટે સામાન્ય NPK ગુણોત્તર: 40:20:20 કિગ્રા/હેક્ટર.",
    management_millet_fert_rec_2:
      "અડધો N અને સંપૂર્ણ P અને K પાયાના ડોઝ તરીકે આપો.",
    management_millet_fert_rec_3:
      "વાવણીના લગભગ 30 દિવસ પછી બાકીનો અડધો N ટોપ ડ્રેસ કરો.",
    management_millet_pest_1_name: "શૂટ ફ્લાય અને સ્ટેમ બોરર",
    management_millet_pest_1_control:
      "નાના બાજરી સામાન્ય રીતે સખત હોય છે. ઇમિડાક્લોપ્રિડ સાથે બીજની માવજત મદદ કરી શકે છે. સ્વચ્છ ખેતી ચાવીરૂપ છે.",
    management_millet_pest_2_name: "બ્લાસ્ટ અને રસ્ટ",
    management_millet_pest_2_control:
      "પ્રતિકારક જાતોનો ઉપયોગ કરો. સામાન્ય રીતે, નાના બાજરી માટે રાસાયણિક નિયંત્રણ આર્થિક નથી.",
    management_mustard_fert_rec_1: "પિયત NPK ગુણોત્તર: 80:40:40 કિગ્રા/હેક્ટર.",
    management_mustard_fert_rec_2:
      "સલ્ફર નિર્ણાયક છે: જીપ્સમ અથવા બેન્ટોનાઇટ સલ્ફર દ્વારા 40 કિગ્રા/હેક્ટર સલ્ફર આપો.",
    management_mustard_fert_rec_3:
      "વાવણી વખતે અડધો N અને સંપૂર્ણ P, K, S આપો. પ્રથમ પિયત (30-35 DAS) વખતે બાકીનો N ટોપ ડ્રેસ કરો.",
    management_mustard_pest_1_name: "સરસવ એફિડ",
    management_mustard_pest_1_control:
      "10-15% ઉપદ્રવ પર ડાયમેથોએટ 30 EC અથવા ઇમિડાક્લોપ્રિડ 17.8 SL સાથે પ્રથમ છંટકાવ.",
    management_mustard_pest_2_name: "વ્હાઇટ રસ્ટ અને અલ્ટરનારિયા બ્લાઇટ",
    management_mustard_pest_2_control:
      "પ્રતિકારક જાતોનો ઉપયોગ કરો. મેન્કોઝેબ અથવા મેટાલેક્સિલનો છંટકાવ કરો.",
    management_onion_fert_rec_1:
      "સામાન્ય NPK ગુણોત્તર: 100:50:50 કિગ્રા/હેક્ટર, 50 કિગ્રા/હેક્ટર સલ્ફર સાથે.",
    management_onion_fert_rec_2: "20-25 ટન/હેક્ટર FYM આપો.",
    management_onion_fert_rec_3:
      "અડધો N અને સંપૂર્ણ P, K, S પાયા તરીકે આપો. રોપણી પછી 30 અને 45 દિવસે બે ભાગમાં બાકીનો N ટોપ ડ્રેસ કરો.",
    management_onion_pest_1_name: "થ્રિપ્સ",
    management_onion_pest_1_control:
      "વાદળી સ્ટીકી ટ્રેપ્સનો ઉપયોગ કરો. ફિપ્રોનિલ 5 SC અથવા પ્રોફેનોફોસ 50 EC સાથે છંટકાવ કરો.",
    management_onion_pest_2_name: "પર્પલ બ્લોચ",
    management_onion_pest_2_control:
      "મેન્કોઝેબ + કાર્બેન્ડાઝીમ અથવા ક્લોરોથાલોનિલ સાથે છંટકાવ કરો.",
    management_pigeonpea_fert_rec_1:
      "સ્ટાર્ટર NPK ડોઝ: 20:40:20 કિગ્રા/હેક્ટર. બધા પાયા તરીકે આપો.",
    management_pigeonpea_fert_rec_2:
      "રાઇઝોબિયમ અને PSB કલ્ચર સાથે બીજની માવજતની ખૂબ ભલામણ કરવામાં આવે છે.",
    management_pigeonpea_fert_rec_3:
      "સલ્ફરનો ઉપયોગ (20 કિગ્રા/હેક્ટર) ઉપજમાં સુધારો કરી શકે છે.",
    management_pigeonpea_pest_1_name: "પોડ બોરર કોમ્પ્લેક્સ",
    management_pigeonpea_pest_1_control:
      "ફેરોમોન ટ્રેપ્સ સાથે મોનિટર કરો. ઇન્ડોક્સાકાર્બ 14.5 SC અથવા ઇમામેક્ટીન બેન્ઝોએટ 5 SG સાથે છંટકાવ કરો.",
    management_pigeonpea_pest_2_name: "ફ્યુઝેરિયમ વિલ્ટ",
    management_pigeonpea_pest_2_control:
      "પ્રતિકારક જાતોનો ઉપયોગ કરો. ઊંડી ઉનાળાની ખેડ. ટ્રાઇકોડર્મા સાથે બીજની માવજત.",
    management_potato_fert_rec_1: "NPK ગુણોત્તર: 120:80:100 કિગ્રા/હેક્ટર.",
    management_potato_fert_rec_2: "25-30 ટન/હેક્ટર FYM આપો.",
    management_potato_fert_rec_3:
      "વાવેતર વખતે અડધો N અને સંપૂર્ણ P અને K આપો. માટી ચઢાવતી વખતે (વાવેતરના 25-30 દિવસ પછી) બાકીનો N આપો.",
    management_potato_pest_1_name: "એફિડ્સ",
    management_potato_pest_1_control:
      "વાયરસ માટે વેક્ટર. ઇમિડાક્લોપ્રિડ 17.8 SL નો છંટકાવ કરો.",
    management_potato_pest_2_name: "લેટ બ્લાઇટ",
    management_potato_pest_2_control:
      "નિર્ણાયક રોગ. મેન્કોઝેબ સાથે પ્રોફીલેક્ટિક સ્પ્રે. મેટાલેક્સિલ + મેન્કોઝેબ અથવા સાયમોક્સાનિલ + મેન્કોઝેબ સાથે ઉપચારાત્મક સ્પ્રે.",
    management_ragi_fert_rec_1: "NPK ગુણોત્તર: 40:20:20 કિગ્રા/હેક્ટર.",
    management_ragi_fert_rec_2:
      "અડધો N અને સંપૂર્ણ P અને K પાયાના ડોઝ તરીકે આપો.",
    management_ragi_fert_rec_3:
      "વાવણી/રોપણીના 25-30 દિવસ પછી બાકીનો અડધો N ટોપ ડ્રેસ કરો.",
    management_ragi_pest_1_name: "સ્ટેમ બોરર",
    management_ragi_pest_1_control:
      "સ્વચ્છ ખેતી. જો ગંભીર હોય, તો કાર્બોફ્યુરાન 3G દાણાદાર નાખો.",
    management_ragi_pest_2_name: "બ્લાસ્ટ (ગરદન અને આંગળી)",
    management_ragi_pest_2_control:
      "પ્રતિકારક જાતોનો ઉપયોગ કરો. કાર્બેન્ડાઝીમ સાથે બીજની માવજત. ટ્રાઇસાયક્લાઝોલનો છંટકાવ કરો.",
    management_rice_fert_rec_1:
      "નીચાણવાળી જમીન NPK ગુણોત્તર: 100:60:60 કિગ્રા/હેક્ટર.",
    management_rice_fert_rec_2:
      "ઉચાણવાળી જમીન NPK ગુણોત્તર: 90:60:60 કિગ્રા/હેક્ટર.",
    management_rice_fert_rec_3:
      "નાઇટ્રોજનને 3 ભાગમાં આપો: પાયામાં, ફૂટતી વખતે અને ડુંડી નીકળવાની શરૂઆતમાં.",
    management_rice_fert_rec_4:
      "જસતની ઉણપવાળી જમીનમાં 25 કિગ્રા/હેક્ટર ઝીંક સલ્ફેટ ઉમેરો.",
    management_rice_fert_rec_5:
      "રોપણી પહેલાં શણ અથવા ઈક્કડ સાથે લીલો પડવાશ કરવો ખૂબ ફાયદાકારક છે.",
    management_rice_pest_1_name: "પીળો ગાભમારો",
    management_rice_pest_1_control:
      "ફેરોમોન ટ્રેપ લગાવો. લણણી પછી, પ્યુપાને ખુલ્લા કરવા માટે ખેતરમાં ખેડાણ કરો. કાર્ટાપ હાઇડ્રોક્લોરાઇડ 4G અથવા ફિપ્રોનિલ 0.3 GR નો છંટકાવ કરો.",
    management_rice_pest_2_name: "બદામી ચૂસિયાં (BPH)",
    management_rice_pest_2_control:
      "વધુ પડતા નાઇટ્રોજનનો ઉપયોગ ટાળો. વારાફરતી ભીની અને સૂકી સ્થિતિ જાળવો. છોડના પાયા પર બુપ્રોફેઝિન 25 SC અથવા ઇમિડાક્લોપ્રિડ 17.8 SL નો છંટકાવ કરો.",
    management_rice_pest_3_name: "બ્લાસ્ટ અને શીથ બ્લાઇટ",
    management_rice_pest_3_control:
      "ટ્રાઇસાયક્લાઝોલથી બીજની માવજત કરો. નિયંત્રણ માટે, ટ્રાઇસાયક્લાઝોલ 75 WP અથવા હેક્સાકોનાઝોલ 5 EC નો છંટકાવ કરો.",
    management_soybean_fert_rec_1:
      "NPK ગુણોત્તર: 20:60-80:40 કિગ્રા/હેક્ટર. વાવણી વખતે બધું આપો.",
    management_soybean_fert_rec_2:
      "રાઇઝોબિયમ જેપોનિકમ અને PSB સાથે બીજ ઇનોક્યુલેશન આવશ્યક છે.",
    management_soybean_fert_rec_3:
      "વધુ સારી વૃદ્ધિ અને તેલ સામગ્રી માટે 20 કિગ્રા/હેક્ટર સલ્ફર આપો.",
    management_soybean_pest_1_name: "ગર્ડલ બીટલ અને સ્ટેમ ફ્લાય",
    management_soybean_pest_1_control:
      "થાઇમેથોક્સમ + લેમ્બ્ડા સાયહાલોથ્રિન અથવા પ્રોફેનોફોસ + સાયપરમેથ્રિન સાથે છંટકાવ કરો.",
    management_soybean_pest_2_name: "યલો મોઝેક વાયરસ",
    management_soybean_pest_2_control:
      "સફેદ માખી દ્વારા વાહક. પ્રતિકારક જાતોનો ઉપયોગ કરો. થાઇમેથોક્સમ અથવા ઇમિડાક્લોપ્રિડ વડે સફેદ માખીને નિયંત્રિત કરો.",
    management_sugarcane_fert_rec_1:
      "સામાન્ય NPK ગુણોત્તર: 275:62.5:112.5 કિગ્રા/હેક્ટર.",
    management_sugarcane_fert_rec_2:
      "નાઇટ્રોજનને 3 ભાગમાં આપો (વાવણીના 30, 60, 90 દિવસ પછી).",
    management_sugarcane_fert_rec_3:
      "છેલ્લી ખેડ પહેલા 12.5 ટન/હેક્ટર ફાર્મ યાર્ડ મેન્યુર (FYM) આપો.",
    management_sugarcane_fert_rec_4:
      "પોષક તત્વોની ઉપલબ્ધતા વધારવા માટે એઝોસ્પિરિલમ અને ફોસ્ફોબેક્ટેરિયા જેવા જૈવ-ઉર્વરકોનો ઉપયોગ કરો.",
    management_sugarcane_fert_rec_5:
      "કચરો મલ્ચિંગ ભેજનું સંરક્ષણ કરવામાં મદદ કરે છે અને કાર્બનિક પદાર્થ ઉમેરે છે.",
    management_sugarcane_pest_1_name: "પ્રારંભિક શૂટ બોરર",
    management_sugarcane_pest_1_control:
      "વાવણી પછી કચરો મલ્ચિંગ. લાઇટ ટ્રેપ્સ ઇન્સ્ટોલ કરો. જમીનમાં ક્લોરેન્ટ્રાનિલિપ્રોલ 0.4 GR અથવા ફિપ્રોનિલ 0.3 GR આપો.",
    management_sugarcane_pest_2_name: "ઊધઈ",
    management_sugarcane_pest_2_control:
      "વાવણી પહેલાં ક્લોરપાયરીફોસ 20 EC અથવા ઇમિડાક્લોપ્રિડ 70 WS દ્રાવણ સાથે સેટ્સની માવજત કરો.",
    management_sugarcane_pest_3_name: "લાલ સડો",
    management_sugarcane_pest_3_control:
      "રોગમુક્ત સેટ્સનો ઉપયોગ કરો. કાર્બેન્ડાઝીમ 50 WP સાથે સેટની માવજત. અસરગ્રસ્ત ગુચ્છોને દૂર કરો અને નાશ કરો.",
    management_tea_fert_rec_1:
      "પોષક તત્વોનો ઉપયોગ કાપણી ચક્ર અને અપેક્ષિત ઉપજ પર આધારિત છે.",
    management_tea_fert_rec_2:
      "એક સામાન્ય N:K ગુણોત્તર યુવાન ચા માટે 2:1 અને પુખ્ત ચા માટે 1:1 છે.",
    management_tea_fert_rec_3:
      "વ્યય ટાળવા માટે પ્રતિ વર્ષ 4-6 વિભાજીત ડોઝમાં ખાતરો આપો.",
    management_tea_fert_rec_4:
      "ઝીંક, મેગ્નેશિયમ અને બોરોનનો પર્ણસમૂહનો ઉપયોગ સામાન્ય પ્રથા છે.",
    management_tea_pest_1_name: "ચા મચ્છર બગ",
    management_tea_pest_1_control:
      "થાઇમેથોક્સમ + લેમ્બ્ડા સાયહાલોથ્રિનનો છંટકાવ કરો.",
    management_tea_pest_2_name: "લાલ સ્પાઇડર માઇટ",
    management_tea_pest_2_control:
      "પ્રોપારગાઇટ 57 EC અથવા ફેનપાયરોક્સિમેટ 5 EC નો છંટકાવ કરો.",
    management_tea_pest_3_name: "બ્લિસ્ટર બ્લાઇટ",
    management_tea_pest_3_control:
      "નિયમિત ચૂંટવાથી રોગ ઓછો થાય છે. ચોમાસા દરમિયાન હેક્સાકોનાઝોલ + કોપર ઓક્સીક્લોરાઇડનો છંટકાવ કરો.",
    management_tomato_fert_rec_1:
      "હાઇબ્રિડ NPK ગુણોત્તર: 120:80:80 કિગ્રા/હેક્ટર.",
    management_tomato_fert_rec_2: "જમીનની તૈયારી દરમિયાન 25 ટન/હેક્ટર FYM આપો.",
    management_tomato_fert_rec_3:
      "અડધો N અને સંપૂર્ણ P અને K પાયા તરીકે આપો. રોપણી પછી 30 અને 45 દિવસે બાકીનો N ભાગોમાં આપો.",
    management_tomato_fert_rec_4:
      "બ્લોસમ-એન્ડ રોટને રોકવા માટે કેલ્શિયમ મહત્વપૂર્ણ છે. ફર્ટિગેશન માટે કેલ્શિયમ નાઇટ્રેટનો ઉપયોગ કરો.",
    management_tomato_pest_1_name: "ફળ કોરી ખાનાર (હેલિકોવરપા)",
    management_tomato_pest_1_control:
      "મોનિટરિંગ માટે ફેરોમોન ટ્રેપ્સ. ઇમામેક્ટીન બેન્ઝોએટ 5 SG સાથે છંટકાવ કરો.",
    management_tomato_pest_2_name: "લીફ કર્લ વાયરસ",
    management_tomato_pest_2_control:
      "સફેદ માખી દ્વારા વાહક. પ્રતિકારક હાઇબ્રિડનો ઉપયોગ કરો. પીળા સ્ટીકી ટ્રેપ્સ અને ઇમિડાક્લોપ્રિડના છંટકાવથી સફેદ માખીને નિયંત્રિત કરો.",
    management_turmeric_fert_rec_1:
      "પાયાના ડોઝ તરીકે 30 ટન/હેક્ટર FYM અથવા કમ્પોસ્ટ આપો.",
    management_turmeric_fert_rec_2: "NPK ગુણોત્તર: 60:50:120 કિગ્રા/હેક્ટર.",
    management_turmeric_fert_rec_3:
      "સંપૂર્ણ P અને અડધો K પાયા તરીકે આપો. વાવણીના 45 અને 90 દિવસે બે ભાગમાં N અને બાકીનો K આપો.",
    management_turmeric_fert_rec_4:
      "વાવણી પછી તરત જ લીલા પાંદડાથી ખેતરને મલ્ચ કરો.",
    management_turmeric_pest_1_name: "શૂટ બોરર",
    management_turmeric_pest_1_control:
      "મેલાથિઓન 50 EC અથવા ડાયમેથોએટ 30 EC સાથે છંટકાવ કરો.",
    management_turmeric_pest_2_name: "રાઇઝોમ રોટ",
    management_turmeric_pest_2_control:
      "ઉત્તમ ડ્રેનેજની ખાતરી કરો. બીજ રાઇઝોમની માવજત કરો અને જમીનને મેન્કોઝેબ અથવા મેટાલેક્સિલથી પલાળો.",
    management_wheat_fert_rec_1: "પિયત NPK ગુણોત્તર: 120:60:40 કિગ્રા/હેક્ટર.",
    management_wheat_fert_rec_2:
      "વાવણી વખતે 1/2 નાઇટ્રોજન ડોઝ + સંપૂર્ણ P અને K આપો. પ્રથમ પિયત વખતે બાકીનો N આપો.",
    management_wheat_fert_rec_3: "મોડી વાવેલા ઘઉં માટે, N ડોઝ 25% વધારો.",
    management_wheat_fert_rec_4:
      "સલ્ફરની ઉણપવાળી જમીનમાં 20 કિગ્રા/હેક્ટર સલ્ફર આપો.",
    management_wheat_fert_rec_5:
      "ચોક્કસ ખાતરના ઉપયોગ માટે જમીનનું પરીક્ષણ નિર્ણાયક છે.",
    management_wheat_pest_1_name: "એફિડ્સ",
    management_wheat_pest_1_control:
      "લેડીબર્ડ ભમરા જેવા કુદરતી શિકારીઓનું સંરક્ષણ કરો. જો ગંભીર હોય, તો થાઇમેથોક્સમ 25 WG અથવા ઇમિડાક્લોપ્રિડ 17.8 SL સાથે છંટકાવ કરો.",
    management_wheat_pest_2_name: "ઊધઈ",
    management_wheat_pest_2_control:
      "ફિપ્રોનિલ 5 SC સાથે બીજની માવજત. ઉભા પાક માટે, સિંચાઈના પાણી સાથે ક્લોરપાયરીફોસ 20 EC આપો.",
    management_wheat_pest_3_name: "પીળો ગેરુ",
    management_wheat_pest_3_control:
      "પ્રતિકારક જાતો વાવો. રોગના પ્રથમ સંકેત પર પ્રોપિકોનાઝોલ 25 EC અથવા ટેબુકોનાઝોલ 250 EC નો છંટકાવ કરો.",
    // New Irrigation
    card_irrigation_recs: "સિંચાઈ વ્યવસ્થાપન",
    card_no_irrigation_data: "આ પાક માટે સિંચાઈની ભલામણો હજુ ઉપલબ્ધ નથી.",
    irrigation_critical_stages_title: "સિંચાઈ માટેના નિર્ણાયક તબક્કા",
    irrigation_general_tips_title: "સામાન્ય સિંચાઈ ટિપ્સ",
    irrigation_wheat_cs_1: "તાજ મૂળની શરૂઆત (CRI) - વાવણીના 20-25 દિવસ પછી.",
    irrigation_wheat_cs_2: "ફૂટવાનો તબક્કો - 40-45 દિવસ પછી.",
    irrigation_wheat_cs_3: "લેટ જોઇન્ટિંગ - 60-65 દિવસ પછી.",
    irrigation_wheat_cs_4: "ફૂલ આવવાનો તબક્કો - 80-85 દિવસ પછી.",
    irrigation_wheat_cs_5: "દૂધિયો દાણો - 100-105 દિવસ પછી.",
    irrigation_wheat_tip_1:
      "હળવી અને વારંવાર સિંચાઈ કરો. નિર્ણાયક તબક્કે પાણીની ખેંચ ટાળો.",
    irrigation_wheat_tip_2:
      "પાણી બચાવવા માટે ફુવારા અથવા ટપક સિંચાઈની ખૂબ ભલામણ કરવામાં આવે છે.",
    irrigation_rice_cs_1: "સક્રિય ફૂટવાનો તબક્કો.",
    irrigation_rice_cs_2: "કણસલાની શરૂઆતથી ફૂલ આવવા સુધી.",
    irrigation_rice_tip_1:
      "રોપણીથી લણણીના 15 દિવસ પહેલા સુધી ખેતરમાં 2-5 સેમી પાણી ભરેલું રાખો.",
    irrigation_rice_tip_2:
      "પાણી બચાવવા માટે વૈકલ્પિક ભીના અને સૂકવણી (AWD) પદ્ધતિનો અભ્યાસ કરો.",
    irrigation_cotton_cs_1:
      "ફૂલ આવવાના અને જીંડવા બનવાના તબક્કા સૌથી નિર્ણાયક છે.",
    irrigation_cotton_tip_1:
      "કપાસ પાણી ભરાવા માટે સંવેદનશીલ છે. યોગ્ય નિકાલની ખાતરી કરો.",
    irrigation_cotton_tip_2:
      "ટપક સિંચાઈ અત્યંત અસરકારક છે, 40-50% પાણી બચાવે છે અને ઉપજ વધારે છે.",
    irrigation_sugarcane_cs_1: "રચનાત્મક તબક્કો (વાવેતર પછીના પ્રથમ 120 દિવસ).",
    irrigation_sugarcane_cs_2: "ભવ્ય વૃદ્ધિનો તબક્કો.",
    irrigation_sugarcane_tip_1:
      "ઉનાળામાં 7-10 દિવસના અને શિયાળામાં 15-20 દિવસના અંતરે સિંચાઈ કરો.",
    irrigation_sugarcane_tip_2:
      "ધોરિયા પિયત સામાન્ય છે, પરંતુ ટપક સિંચાઈથી પાણીના ઉપયોગની કાર્યક્ષમતામાં નોંધપાત્ર સુધારો થઈ શકે છે.",
    irrigation_maize_cs_1: "ઘૂંટણ સુધીની ઊંચાઈનો તબક્કો.",
    irrigation_maize_cs_2: "નર અને માદા ફૂલ આવવાનો તબક્કો.",
    irrigation_maize_cs_3: "દાણા ભરવાનો તબક્કો.",
    irrigation_maize_tip_1:
      "ફૂલ આવવાના સમયગાળા દરમિયાન પાણીની ખેંચ ટાળો કારણ કે તે ઉપજને ગંભીર રીતે અસર કરી શકે છે.",
    irrigation_maize_tip_2:
      "સિંચાઈ કરતા પહેલા જમીનનો ભેજ તપાસો. જમીન સંપૂર્ણપણે સૂકી ન હોવી જોઈએ.",
    crop_names: {
      "Bajra (Pearl Millet)": "બાજરી",
      Banana: "કેળું",
      "Barley (Jau)": "જવ",
      Chilli: "મરચું",
      Coconut: "નાળિયેર",
      Cotton: "કપાસ",
      Ginger: "આદુ",
      "Gram (Chickpea)": "ચણા",
      Grapes: "દ્રાક્ષ",
      Groundnut: "મગફળી",
      "Jowar (Sorghum)": "જુવાર",
      Jute: "શણ",
      "Lentil (Masur)": "મસૂર",
      Maize: "મકાઈ",
      Mango: "કેરી",
      Millet: "બાજરો",
      Mustard: "સરસવ",
      Onion: "ડુંગળી",
      "Pigeon Pea (Arhar)": "તુવેર",
      Potato: "બટાકા",
      "Ragi (Finger Millet)": "રાગી",
      Rice: "ચોખા",
      Soybean: "સોયાબીન",
      Sugarcane: "શેરડી",
      Tea: "ચા",
      Tomato: "ટામેટા",
      Turmeric: "હળદર",
      Wheat: "ઘઉં",
    },
    soil_types: {
      Alluvial: "કાંપવાળી",
      Black: "કાળી",
      "Red and Yellow": "લાલ અને પીળી",
      Laterite: "લેટેરાઇટ",
      Arid: "શુષ્ક",
      Forest: "જંગલ",
      Loamy: "કાંપવાળી",
      Clayey: "માટીવાળી",
      Sandy: "રેતાળ",
      Silty: "સિલ્ટી",
      Peaty: "પીટી",
    },
    states: {
      AN: "આંદામાન અને નિકોબાર ટાપુઓ",
      AP: "આંધ્ર પ્રદેશ",
      AR: "અરુણાચલ પ્રદેશ",
      AS: "આસામ",
      BR: "બિહાર",
      CH: "ચંદીગઢ",
      CT: "છત્તીસગઢ",
      DN: "દાદરા અને નગર હવેલી અને દમણ અને દીવ",
      DL: "દિલ્હી",
      GA: "ગોવા",
      GJ: "ગુજરાત",
      HR: "હરિયાણા",
      HP: "હિમાચલ પ્રદેશ",
      JK: "જમ્મુ અને કાશ્મીર",
      JH: "ઝારખંડ",
      KA: "કર્ણાટક",
      KL: "કેરળ",
      LA: "લદ્દાખ",
      LD: "લક્ષદ્વીપ",
      MP: "મધ્ય પ્રદેશ",
      MH: "મહારાષ્ટ્ર",
      MN: "મણિપુર",
      ML: "મેઘાલય",
      MZ: "મિઝોરમ",
      NL: "નાગાલેન્ડ",
      OR: "ઓડિશા",
      PY: "પુડુચેરી",
      PB: "પંજાબ",
      RJ: "રાજસ્થાન",
      SK: "સિક્કિમ",
      TN: "તમિલનાડુ",
      TG: "તેલંગાણા",
      TR: "ત્રિપુરા",
      UP: "ઉત્તર પ્રદેશ",
      UT: "ઉત્તરાખંડ",
      WB: "પશ્ચિમ બંગાળ",
    },
    districts: {
      GJ: {
        Ahmedabad: "અમદાવાદ",
        Amreli: "અમરેલી",
        Anand: "આણંદ",
        Aravalli: "અરવલ્લી",
        Banaskantha: "બનાસકાંઠા",
        Bharuch: "ભરૂચ",
        Bhavnagar: "ભાવનગર",
        Botad: "બોટાદ",
        "Chhota Udepur": "છોટા ઉદેપુર",
        Dahod: "દાહોદ",
        Dangs: "ડાંગ",
        "Devbhoomi Dwarka": "દેવભૂમિ દ્વારકા",
        Gandhinagar: "ગાંધીનગર",
        "Gir Somnath": "ગીર સોમનાથ",
        Jamnagar: "જામનગર",
        Junagadh: "જુનાગઢ",
        Kachchh: "કચ્છ",
        Kheda: "ખેડા",
        Mahisagar: "મહીસાગર",
        Mehsana: "મહેસાણા",
        Morbi: "મોરબી",
        Narmada: "નર્મદા",
        Navsari: "નવસારી",
        Panchmahal: "પંચમહાલ",
        Patan: "પાટણ",
        Porbandar: "પોરબંદર",
        Rajkot: "રાજકોટ",
        Sabarkantha: "સાબરકાંઠા",
        Surat: "સુરત",
        Surendranagar: "સુરેન્દ્રનગર",
        Tapi: "તાપી",
        Vadodara: "વડોદરા",
        Valsad: "વલસાડ",
      },
    },
  },
  as: { language_name: "অসমীয়া" },
  bn: { language_name: "বাংলা" },
  brx: { language_name: "बर'" },
  doi: { language_name: "डोगरी" },
  kn: { language_name: "ಕನ್ನಡ" },
  ks: { language_name: "کٲشُر" },
  kok: { language_name: "कोंकणी" },
  mai: { language_name: "मैथिली" },
  ml: { language_name: "മലയാളം" },
  mni: { language_name: "মৈতৈলোন্" },
  mr: { language_name: "मराठी" },
  ne: { language_name: "नेपाली" },
  or: { language_name: "ଓଡ଼ିଆ" },
  pa: { language_name: "ਪੰਜਾਬੀ" },
  sa: { language_name: "संस्कृतम्" },
  sat: { language_name: "ᱥᱟᱱᱛᱟᱲᱤ" },
  sd: { language_name: "सिन्धी" },
  ta: { language_name: "தமிழ்" },
  te: { language_name: "తెలుగు" },
  ur: { language_name: "اردو" },
};
const LanguageContext = createContext();
const useLanguage = () => useContext(LanguageContext);

// --- Static Datasets ---
const CROP_DATA = {
  "Bajra (Pearl Millet)": {
    baselineYield: 1.3,
    maturityDays: 85,
    ph: [6.0, 7.5],
    ref: "ICAR",
    cost_per_hectare: 18000,
  },
  Banana: {
    baselineYield: 60.0,
    maturityDays: 330,
    ph: [6.0, 7.5],
    ref: "NHB",
    cost_per_hectare: 120000,
  },
  "Barley (Jau)": {
    baselineYield: 2.9,
    maturityDays: 120,
    ph: [6.5, 8.0],
    ref: "ICAR",
    cost_per_hectare: 24000,
  },
  Chilli: {
    baselineYield: 2.2,
    maturityDays: 150,
    ph: [6.5, 7.5],
    ref: "NHB",
    cost_per_hectare: 50000,
  },
  Coconut: {
    baselineYield: 12.0,
    maturityDays: 2000,
    ph: [5.5, 8.0],
    ref: "NHB",
    cost_per_hectare: 100000,
  },
  Cotton: {
    baselineYield: 0.46,
    maturityDays: 160,
    ph: [5.8, 8.0],
    ref: "Directorate of Economics and Statistics",
    cost_per_hectare: 55000,
  },
  Ginger: {
    baselineYield: 4.5,
    maturityDays: 240,
    ph: [6.0, 7.0],
    ref: "ICAR",
    cost_per_hectare: 90000,
  },
  "Gram (Chickpea)": {
    baselineYield: 1.0,
    maturityDays: 100,
    ph: [6.0, 8.0],
    ref: "ICAR",
    cost_per_hectare: 25000,
  },
  Grapes: {
    baselineYield: 25.0,
    maturityDays: 730,
    ph: [6.5, 8.0],
    ref: "NHB",
    cost_per_hectare: 250000,
  },
  Groundnut: {
    baselineYield: 1.5,
    maturityDays: 110,
    ph: [6.0, 7.0],
    ref: "ICAR",
    cost_per_hectare: 40000,
  },
  "Jowar (Sorghum)": {
    baselineYield: 1.0,
    maturityDays: 110,
    ph: [6.0, 8.5],
    ref: "ICAR",
    cost_per_hectare: 22000,
  },
  Jute: {
    baselineYield: 2.3,
    maturityDays: 130,
    ph: [6.0, 7.5],
    ref: "Directorate of Economics and Statistics",
    cost_per_hectare: 40000,
  },
  "Lentil (Masur)": {
    baselineYield: 0.9,
    maturityDays: 110,
    ph: [6.0, 8.0],
    ref: "ICAR",
    cost_per_hectare: 23000,
  },
  Maize: {
    baselineYield: 3.2,
    maturityDays: 100,
    ph: [5.8, 7.0],
    ref: "Directorate of Economics and Statistics",
    cost_per_hectare: 30000,
  },
  Mango: {
    baselineYield: 10.0,
    maturityDays: 1500,
    ph: [6.5, 7.5],
    ref: "NHB",
    cost_per_hectare: 90000,
  },
  Millet: {
    baselineYield: 1.1,
    maturityDays: 80,
    ph: [5.0, 6.5],
    ref: "ICAR",
    cost_per_hectare: 20000,
  },
  Mustard: {
    baselineYield: 1.5,
    maturityDays: 120,
    ph: [6.0, 7.5],
    ref: "Directorate of Economics and Statistics",
    cost_per_hectare: 26000,
  },
  Onion: {
    baselineYield: 17.0,
    maturityDays: 120,
    ph: [6.0, 7.0],
    ref: "NHB",
    cost_per_hectare: 65000,
  },
  "Pigeon Pea (Arhar)": {
    baselineYield: 0.8,
    maturityDays: 160,
    ph: [6.5, 7.5],
    ref: "ICAR",
    cost_per_hectare: 27000,
  },
  Potato: {
    baselineYield: 23.0,
    maturityDays: 100,
    ph: [5.0, 6.5],
    ref: "NHB",
    cost_per_hectare: 70000,
  },
  "Ragi (Finger Millet)": {
    baselineYield: 1.7,
    maturityDays: 100,
    ph: [5.5, 7.5],
    ref: "ICAR",
    cost_per_hectare: 19000,
  },
  Rice: {
    baselineYield: 4.1,
    maturityDays: 125,
    ph: [5.5, 7.0],
    ref: "Directorate of Economics and Statistics",
    cost_per_hectare: 45000,
  },
  Soybean: {
    baselineYield: 1.2,
    maturityDays: 105,
    ph: [6.0, 7.0],
    ref: "Directorate of Economics and Statistics",
    cost_per_hectare: 28000,
  },
  Sugarcane: {
    baselineYield: 79.5,
    maturityDays: 330,
    ph: [6.5, 7.5],
    ref: "Directorate of Economics and Statistics",
    cost_per_hectare: 80000,
  },
  Tea: {
    baselineYield: 2.0,
    maturityDays: 1095,
    ph: [4.5, 5.5],
    ref: "Tea Board of India",
    cost_per_hectare: 150000,
  },
  Tomato: {
    baselineYield: 25.0,
    maturityDays: 90,
    ph: [6.0, 7.0],
    ref: "NHB",
    cost_per_hectare: 60000,
  },
  Turmeric: {
    baselineYield: 5.5,
    maturityDays: 270,
    ph: [6.0, 7.5],
    ref: "ICAR",
    cost_per_hectare: 85000,
  },
  Wheat: {
    baselineYield: 3.6,
    maturityDays: 115,
    ph: [6.0, 7.5],
    ref: "Directorate of Economics and Statistics",
    cost_per_hectare: 35000,
  },
};

const CROP_MANAGEMENT_DATA = {
  "Bajra (Pearl Millet)": {
    fertilizer: {
      title: "management_fertilizer_title",
      recommendations: [
        "management_bajra_fert_rec_1",
        "management_bajra_fert_rec_2",
        "management_bajra_fert_rec_3",
        "management_bajra_fert_rec_4",
      ],
    },
    pest_control: {
      title: "management_pest_title",
      methods: [
        {
          pest: "management_bajra_pest_1_name",
          control: "management_bajra_pest_1_control",
        },
        {
          pest: "management_bajra_pest_2_name",
          control: "management_bajra_pest_2_control",
        },
        {
          pest: "management_bajra_pest_3_name",
          control: "management_bajra_pest_3_control",
        },
      ],
    },
  },
  Banana: {
    fertilizer: {
      title: "management_fertilizer_title",
      recommendations: [
        "management_banana_fert_rec_1",
        "management_banana_fert_rec_2",
        "management_banana_fert_rec_3",
        "management_banana_fert_rec_4",
      ],
    },
    pest_control: {
      title: "management_pest_title",
      methods: [
        {
          pest: "management_banana_pest_1_name",
          control: "management_banana_pest_1_control",
        },
        {
          pest: "management_banana_pest_2_name",
          control: "management_banana_pest_2_control",
        },
        {
          pest: "management_banana_pest_3_name",
          control: "management_banana_pest_3_control",
        },
      ],
    },
  },
  "Barley (Jau)": {
    fertilizer: {
      title: "management_fertilizer_title",
      recommendations: [
        "management_barley_fert_rec_1",
        "management_barley_fert_rec_2",
        "management_barley_fert_rec_3",
        "management_barley_fert_rec_4",
      ],
    },
    pest_control: {
      title: "management_pest_title",
      methods: [
        {
          pest: "management_barley_pest_1_name",
          control: "management_barley_pest_1_control",
        },
        {
          pest: "management_barley_pest_2_name",
          control: "management_barley_pest_2_control",
        },
        {
          pest: "management_barley_pest_3_name",
          control: "management_barley_pest_3_control",
        },
      ],
    },
  },
  Chilli: {
    fertilizer: {
      title: "management_fertilizer_title",
      recommendations: [
        "management_chilli_fert_rec_1",
        "management_chilli_fert_rec_2",
        "management_chilli_fert_rec_3",
      ],
    },
    pest_control: {
      title: "management_pest_title",
      methods: [
        {
          pest: "management_chilli_pest_1_name",
          control: "management_chilli_pest_1_control",
        },
        {
          pest: "management_chilli_pest_2_name",
          control: "management_chilli_pest_2_control",
        },
        {
          pest: "management_chilli_pest_3_name",
          control: "management_chilli_pest_3_control",
        },
      ],
    },
  },
  Coconut: {
    fertilizer: {
      title: "management_fertilizer_title",
      recommendations: [
        "management_coconut_fert_rec_1",
        "management_coconut_fert_rec_2",
        "management_coconut_fert_rec_3",
        "management_coconut_fert_rec_4",
      ],
    },
    pest_control: {
      title: "management_pest_title",
      methods: [
        {
          pest: "management_coconut_pest_1_name",
          control: "management_coconut_pest_1_control",
        },
        {
          pest: "management_coconut_pest_2_name",
          control: "management_coconut_pest_2_control",
        },
        {
          pest: "management_coconut_pest_3_name",
          control: "management_coconut_pest_3_control",
        },
      ],
    },
  },
  Cotton: {
    fertilizer: {
      title: "management_fertilizer_title",
      recommendations: [
        "management_cotton_fert_rec_1",
        "management_cotton_fert_rec_2",
        "management_cotton_fert_rec_3",
        "management_cotton_fert_rec_4",
        "management_cotton_fert_rec_5",
      ],
    },
    pest_control: {
      title: "management_pest_title",
      methods: [
        {
          pest: "management_cotton_pest_1_name",
          control: "management_cotton_pest_1_control",
        },
        {
          pest: "management_cotton_pest_2_name",
          control: "management_cotton_pest_2_control",
        },
      ],
    },
  },
  Ginger: {
    fertilizer: {
      title: "management_fertilizer_title",
      recommendations: [
        "management_ginger_fert_rec_1",
        "management_ginger_fert_rec_2",
        "management_ginger_fert_rec_3",
        "management_ginger_fert_rec_4",
      ],
    },
    pest_control: {
      title: "management_pest_title",
      methods: [
        {
          pest: "management_ginger_pest_1_name",
          control: "management_ginger_pest_1_control",
        },
        {
          pest: "management_ginger_pest_2_name",
          control: "management_ginger_pest_2_control",
        },
      ],
    },
  },
  "Gram (Chickpea)": {
    fertilizer: {
      title: "management_fertilizer_title",
      recommendations: [
        "management_gram_fert_rec_1",
        "management_gram_fert_rec_2",
        "management_gram_fert_rec_3",
      ],
    },
    pest_control: {
      title: "management_pest_title",
      methods: [
        {
          pest: "management_gram_pest_1_name",
          control: "management_gram_pest_1_control",
        },
        {
          pest: "management_gram_pest_2_name",
          control: "management_gram_pest_2_control",
        },
      ],
    },
  },
  Grapes: {
    fertilizer: {
      title: "management_fertilizer_title",
      recommendations: [
        "management_grapes_fert_rec_1",
        "management_grapes_fert_rec_2",
        "management_grapes_fert_rec_3",
        "management_grapes_fert_rec_4",
      ],
    },
    pest_control: {
      title: "management_pest_title",
      methods: [
        {
          pest: "management_grapes_pest_1_name",
          control: "management_grapes_pest_1_control",
        },
        {
          pest: "management_grapes_pest_2_name",
          control: "management_grapes_pest_2_control",
        },
      ],
    },
  },
  Groundnut: {
    fertilizer: {
      title: "management_fertilizer_title",
      recommendations: [
        "management_groundnut_fert_rec_1",
        "management_groundnut_fert_rec_2",
        "management_groundnut_fert_rec_3",
        "management_groundnut_fert_rec_4",
      ],
    },
    pest_control: {
      title: "management_pest_title",
      methods: [
        {
          pest: "management_groundnut_pest_1_name",
          control: "management_groundnut_pest_1_control",
        },
        {
          pest: "management_groundnut_pest_2_name",
          control: "management_groundnut_pest_2_control",
        },
      ],
    },
  },
  "Jowar (Sorghum)": {
    fertilizer: {
      title: "management_fertilizer_title",
      recommendations: [
        "management_jowar_fert_rec_1",
        "management_jowar_fert_rec_2",
        "management_jowar_fert_rec_3",
      ],
    },
    pest_control: {
      title: "management_pest_title",
      methods: [
        {
          pest: "management_jowar_pest_1_name",
          control: "management_jowar_pest_1_control",
        },
        {
          pest: "management_jowar_pest_2_name",
          control: "management_jowar_pest_2_control",
        },
      ],
    },
  },
  Jute: {
    fertilizer: {
      title: "management_fertilizer_title",
      recommendations: [
        "management_jute_fert_rec_1",
        "management_jute_fert_rec_2",
        "management_jute_fert_rec_3",
        "management_jute_fert_rec_4",
      ],
    },
    pest_control: {
      title: "management_pest_title",
      methods: [
        {
          pest: "management_jute_pest_1_name",
          control: "management_jute_pest_1_control",
        },
        {
          pest: "management_jute_pest_2_name",
          control: "management_jute_pest_2_control",
        },
      ],
    },
  },
  "Lentil (Masur)": {
    fertilizer: {
      title: "management_fertilizer_title",
      recommendations: [
        "management_lentil_fert_rec_1",
        "management_lentil_fert_rec_2",
        "management_lentil_fert_rec_3",
      ],
    },
    pest_control: {
      title: "management_pest_title",
      methods: [
        {
          pest: "management_lentil_pest_1_name",
          control: "management_lentil_pest_1_control",
        },
        {
          pest: "management_lentil_pest_2_name",
          control: "management_lentil_pest_2_control",
        },
      ],
    },
  },
  Maize: {
    fertilizer: {
      title: "management_fertilizer_title",
      recommendations: [
        "management_maize_fert_rec_1",
        "management_maize_fert_rec_2",
        "management_maize_fert_rec_3",
      ],
    },
    pest_control: {
      title: "management_pest_title",
      methods: [
        {
          pest: "management_maize_pest_1_name",
          control: "management_maize_pest_1_control",
        },
        {
          pest: "management_maize_pest_2_name",
          control: "management_maize_pest_2_control",
        },
      ],
    },
  },
  Mango: {
    fertilizer: {
      title: "management_fertilizer_title",
      recommendations: [
        "management_mango_fert_rec_1",
        "management_mango_fert_rec_2",
        "management_mango_fert_rec_3",
      ],
    },
    pest_control: {
      title: "management_pest_title",
      methods: [
        {
          pest: "management_mango_pest_1_name",
          control: "management_mango_pest_1_control",
        },
        {
          pest: "management_mango_pest_2_name",
          control: "management_mango_pest_2_control",
        },
      ],
    },
  },
  Millet: {
    fertilizer: {
      title: "management_fertilizer_title",
      recommendations: [
        "management_millet_fert_rec_1",
        "management_millet_fert_rec_2",
        "management_millet_fert_rec_3",
      ],
    },
    pest_control: {
      title: "management_pest_title",
      methods: [
        {
          pest: "management_millet_pest_1_name",
          control: "management_millet_pest_1_control",
        },
        {
          pest: "management_millet_pest_2_name",
          control: "management_millet_pest_2_control",
        },
      ],
    },
  },
  Mustard: {
    fertilizer: {
      title: "management_fertilizer_title",
      recommendations: [
        "management_mustard_fert_rec_1",
        "management_mustard_fert_rec_2",
        "management_mustard_fert_rec_3",
      ],
    },
    pest_control: {
      title: "management_pest_title",
      methods: [
        {
          pest: "management_mustard_pest_1_name",
          control: "management_mustard_pest_1_control",
        },
        {
          pest: "management_mustard_pest_2_name",
          control: "management_mustard_pest_2_control",
        },
      ],
    },
  },
  Onion: {
    fertilizer: {
      title: "management_fertilizer_title",
      recommendations: [
        "management_onion_fert_rec_1",
        "management_onion_fert_rec_2",
        "management_onion_fert_rec_3",
      ],
    },
    pest_control: {
      title: "management_pest_title",
      methods: [
        {
          pest: "management_onion_pest_1_name",
          control: "management_onion_pest_1_control",
        },
        {
          pest: "management_onion_pest_2_name",
          control: "management_onion_pest_2_control",
        },
      ],
    },
  },
  "Pigeon Pea (Arhar)": {
    fertilizer: {
      title: "management_fertilizer_title",
      recommendations: [
        "management_pigeonpea_fert_rec_1",
        "management_pigeonpea_fert_rec_2",
        "management_pigeonpea_fert_rec_3",
      ],
    },
    pest_control: {
      title: "management_pest_title",
      methods: [
        {
          pest: "management_pigeonpea_pest_1_name",
          control: "management_pigeonpea_pest_1_control",
        },
        {
          pest: "management_pigeonpea_pest_2_name",
          control: "management_pigeonpea_pest_2_control",
        },
      ],
    },
  },
  Potato: {
    fertilizer: {
      title: "management_fertilizer_title",
      recommendations: [
        "management_potato_fert_rec_1",
        "management_potato_fert_rec_2",
        "management_potato_fert_rec_3",
      ],
    },
    pest_control: {
      title: "management_pest_title",
      methods: [
        {
          pest: "management_potato_pest_1_name",
          control: "management_potato_pest_1_control",
        },
        {
          pest: "management_potato_pest_2_name",
          control: "management_potato_pest_2_control",
        },
      ],
    },
  },
  "Ragi (Finger Millet)": {
    fertilizer: {
      title: "management_fertilizer_title",
      recommendations: [
        "management_ragi_fert_rec_1",
        "management_ragi_fert_rec_2",
        "management_ragi_fert_rec_3",
      ],
    },
    pest_control: {
      title: "management_pest_title",
      methods: [
        {
          pest: "management_ragi_pest_1_name",
          control: "management_ragi_pest_1_control",
        },
        {
          pest: "management_ragi_pest_2_name",
          control: "management_ragi_pest_2_control",
        },
      ],
    },
  },
  Rice: {
    fertilizer: {
      title: "management_fertilizer_title",
      recommendations: [
        "management_rice_fert_rec_1",
        "management_rice_fert_rec_2",
        "management_rice_fert_rec_3",
        "management_rice_fert_rec_4",
        "management_rice_fert_rec_5",
      ],
    },
    pest_control: {
      title: "management_pest_title",
      methods: [
        {
          pest: "management_rice_pest_1_name",
          control: "management_rice_pest_1_control",
        },
        {
          pest: "management_rice_pest_2_name",
          control: "management_rice_pest_2_control",
        },
        {
          pest: "management_rice_pest_3_name",
          control: "management_rice_pest_3_control",
        },
      ],
    },
  },
  Soybean: {
    fertilizer: {
      title: "management_fertilizer_title",
      recommendations: [
        "management_soybean_fert_rec_1",
        "management_soybean_fert_rec_2",
        "management_soybean_fert_rec_3",
      ],
    },
    pest_control: {
      title: "management_pest_title",
      methods: [
        {
          pest: "management_soybean_pest_1_name",
          control: "management_soybean_pest_1_control",
        },
        {
          pest: "management_soybean_pest_2_name",
          control: "management_soybean_pest_2_control",
        },
      ],
    },
  },
  Sugarcane: {
    fertilizer: {
      title: "management_fertilizer_title",
      recommendations: [
        "management_sugarcane_fert_rec_1",
        "management_sugarcane_fert_rec_2",
        "management_sugarcane_fert_rec_3",
        "management_sugarcane_fert_rec_4",
        "management_sugarcane_fert_rec_5",
      ],
    },
    pest_control: {
      title: "management_pest_title",
      methods: [
        {
          pest: "management_sugarcane_pest_1_name",
          control: "management_sugarcane_pest_1_control",
        },
        {
          pest: "management_sugarcane_pest_2_name",
          control: "management_sugarcane_pest_2_control",
        },
        {
          pest: "management_sugarcane_pest_3_name",
          control: "management_sugarcane_pest_3_control",
        },
      ],
    },
  },
  Tea: {
    fertilizer: {
      title: "management_fertilizer_title",
      recommendations: [
        "management_tea_fert_rec_1",
        "management_tea_fert_rec_2",
        "management_tea_fert_rec_3",
        "management_tea_fert_rec_4",
      ],
    },
    pest_control: {
      title: "management_pest_title",
      methods: [
        {
          pest: "management_tea_pest_1_name",
          control: "management_tea_pest_1_control",
        },
        {
          pest: "management_tea_pest_2_name",
          control: "management_tea_pest_2_control",
        },
        {
          pest: "management_tea_pest_3_name",
          control: "management_tea_pest_3_control",
        },
      ],
    },
  },
  Tomato: {
    fertilizer: {
      title: "management_fertilizer_title",
      recommendations: [
        "management_tomato_fert_rec_1",
        "management_tomato_fert_rec_2",
        "management_tomato_fert_rec_3",
        "management_tomato_fert_rec_4",
      ],
    },
    pest_control: {
      title: "management_pest_title",
      methods: [
        {
          pest: "management_tomato_pest_1_name",
          control: "management_tomato_pest_1_control",
        },
        {
          pest: "management_tomato_pest_2_name",
          control: "management_tomato_pest_2_control",
        },
      ],
    },
  },
  Turmeric: {
    fertilizer: {
      title: "management_fertilizer_title",
      recommendations: [
        "management_turmeric_fert_rec_1",
        "management_turmeric_fert_rec_2",
        "management_turmeric_fert_rec_3",
        "management_turmeric_fert_rec_4",
      ],
    },
    pest_control: {
      title: "management_pest_title",
      methods: [
        {
          pest: "management_turmeric_pest_1_name",
          control: "management_turmeric_pest_1_control",
        },
        {
          pest: "management_turmeric_pest_2_name",
          control: "management_turmeric_pest_2_control",
        },
      ],
    },
  },
  Wheat: {
    fertilizer: {
      title: "management_fertilizer_title",
      recommendations: [
        "management_wheat_fert_rec_1",
        "management_wheat_fert_rec_2",
        "management_wheat_fert_rec_3",
        "management_wheat_fert_rec_4",
        "management_wheat_fert_rec_5",
      ],
    },
    pest_control: {
      title: "management_pest_title",
      methods: [
        {
          pest: "management_wheat_pest_1_name",
          control: "management_wheat_pest_1_control",
        },
        {
          pest: "management_wheat_pest_2_name",
          control: "management_wheat_pest_2_control",
        },
        {
          pest: "management_wheat_pest_3_name",
          control: "management_wheat_pest_3_control",
        },
      ],
    },
  },
};

const CROP_IRRIGATION_DATA = {
  Wheat: {
    critical_stages: {
      title: "irrigation_critical_stages_title",
      stages: [
        "irrigation_wheat_cs_1",
        "irrigation_wheat_cs_2",
        "irrigation_wheat_cs_3",
        "irrigation_wheat_cs_4",
        "irrigation_wheat_cs_5",
      ],
    },
    general_tips: {
      title: "irrigation_general_tips_title",
      tips: ["irrigation_wheat_tip_1", "irrigation_wheat_tip_2"],
    },
  },
  Rice: {
    critical_stages: {
      title: "irrigation_critical_stages_title",
      stages: ["irrigation_rice_cs_1", "irrigation_rice_cs_2"],
    },
    general_tips: {
      title: "irrigation_general_tips_title",
      tips: ["irrigation_rice_tip_1", "irrigation_rice_tip_2"],
    },
  },
  Cotton: {
    critical_stages: {
      title: "irrigation_critical_stages_title",
      stages: ["irrigation_cotton_cs_1"],
    },
    general_tips: {
      title: "irrigation_general_tips_title",
      tips: ["irrigation_cotton_tip_1", "irrigation_cotton_tip_2"],
    },
  },
  Sugarcane: {
    critical_stages: {
      title: "irrigation_critical_stages_title",
      stages: ["irrigation_sugarcane_cs_1", "irrigation_sugarcane_cs_2"],
    },
    general_tips: {
      title: "irrigation_general_tips_title",
      tips: ["irrigation_sugarcane_tip_1", "irrigation_sugarcane_tip_2"],
    },
  },
  Maize: {
    critical_stages: {
      title: "irrigation_critical_stages_title",
      stages: [
        "irrigation_maize_cs_1",
        "irrigation_maize_cs_2",
        "irrigation_maize_cs_3",
      ],
    },
    general_tips: {
      title: "irrigation_general_tips_title",
      tips: ["irrigation_maize_tip_1", "irrigation_maize_tip_2"],
    },
  },
};

const CROP_STATE_SUITABILITY = {
  Rice: ["WB", "UP", "PB", "AP", "TN", "OR", "AS", "CT"],
  Wheat: ["UP", "PB", "HR", "MP", "RJ"],
  Maize: ["KA", "MP", "MH", "RJ", "UP"],
  Cotton: ["GJ", "MH", "TG", "KA", "AP"],
  Sugarcane: ["UP", "MH", "KA", "TN", "GJ"],
  Soybean: ["MP", "MH", "RJ"],
  Groundnut: ["GJ", "RJ", "TN", "AP", "KA"],
  Mustard: ["RJ", "UP", "HR", "MP"],
  Jute: ["WB", "BR", "AS", "OR"],
  Tea: ["AS", "WB", "TN", "KL"],
  Coconut: ["KL", "TN", "KA", "AP"],
  "Bajra (Pearl Millet)": ["RJ", "UP", "HR", "GJ", "MP"],
  "Jowar (Sorghum)": ["MH", "KA", "MP", "TG"],
  "Ragi (Finger Millet)": ["KA", "TN", "UT", "MH"],
  "Gram (Chickpea)": ["MP", "MH", "RJ", "UP", "KA"],
  "Pigeon Pea (Arhar)": ["MH", "MP", "KA", "UP", "GJ"],
  "Lentil (Masur)": ["UP", "MP", "BR", "WB"],
  Potato: ["UP", "WB", "BR", "GJ", "MP"],
  Onion: ["MH", "KA", "MP", "GJ", "RJ"],
  Tomato: ["AP", "MP", "KA", "OR", "GJ"],
  Banana: ["AP", "GJ", "TN", "MH", "UP"],
  Mango: ["UP", "AP", "KA", "BR", "GJ"],
  Grapes: ["MH", "KA", "TN"],
  Chilli: ["AP", "TG", "KA", "MP"],
  Turmeric: ["TG", "MH", "TN", "OR"],
  Ginger: ["MP", "KA", "OR", "AS"],
  "Barley (Jau)": ["UP", "RJ", "MP", "HR"],
  Millet: ["RJ", "KA", "AP", "TN", "MH"],
};

const CROP_SUITABILITY_DATA = {
  "Bajra (Pearl Millet)": {
    season: ["Kharif"],
    temp: [27, 35],
    ph: [6.0, 7.5],
    soil: ["Sandy"],
    humidity: [40, 55],
    rainfall_mm: [400, 600],
  },
  Banana: {
    season: ["Zaid", "Kharif"],
    temp: [25, 35],
    ph: [6.0, 7.5],
    soil: ["Loamy"],
    humidity: [75, 85],
    rainfall_mm: [1800, 2500],
  },
  "Barley (Jau)": {
    season: ["Rabi"],
    temp: [12, 20],
    ph: [6.5, 8.0],
    soil: ["Sandy", "Loamy"],
    humidity: [50, 65],
    rainfall_mm: [300, 450],
  },
  Chilli: {
    season: ["Kharif", "Rabi"],
    temp: [20, 30],
    ph: [6.5, 7.5],
    soil: ["Loamy"],
    humidity: [60, 80],
    rainfall_mm: [600, 1250],
  },
  Coconut: {
    season: ["Kharif", "Zaid"],
    temp: [25, 33],
    ph: [5.5, 8.0],
    soil: ["Loamy", "Sandy"],
    humidity: [70, 85],
    rainfall_mm: [1500, 2500],
  },
  Cotton: {
    season: ["Kharif"],
    temp: [21, 35],
    ph: [5.8, 8.0],
    soil: ["Black", "Clayey"],
    humidity: [55, 75],
    rainfall_mm: [500, 1000],
  },
  Ginger: {
    season: ["Kharif"],
    temp: [25, 35],
    ph: [6.0, 7.0],
    soil: ["Loamy"],
    humidity: [70, 90],
    rainfall_mm: [1500, 3000],
  },
  "Gram (Chickpea)": {
    season: ["Rabi"],
    temp: [15, 25],
    ph: [6.0, 8.0],
    soil: ["Sandy", "Loamy"],
    humidity: [40, 60],
    rainfall_mm: [400, 600],
  },
  Grapes: {
    season: ["Rabi"],
    temp: [15, 40],
    ph: [6.5, 8.0],
    soil: ["Sandy", "Loamy"],
    humidity: [50, 70],
    rainfall_mm: [500, 900],
  },
  Groundnut: {
    season: ["Kharif", "Zaid"],
    temp: [25, 35],
    ph: [6.0, 7.0],
    soil: ["Sandy", "Loamy"],
    humidity: [50, 70],
    rainfall_mm: [500, 700],
  },
  "Jowar (Sorghum)": {
    season: ["Kharif", "Rabi"],
    temp: [26, 34],
    ph: [6.0, 8.5],
    soil: ["Sandy", "Loamy"],
    humidity: [40, 60],
    rainfall_mm: [400, 650],
  },
  Jute: {
    season: ["Kharif"],
    temp: [24, 35],
    ph: [6.0, 7.5],
    soil: ["Alluvial", "Loamy"],
    humidity: [70, 90],
    rainfall_mm: [1500, 2000],
  },
  "Lentil (Masur)": {
    season: ["Rabi"],
    temp: [18, 30],
    ph: [6.0, 8.0],
    soil: ["Loamy"],
    humidity: [50, 65],
    rainfall_mm: [300, 400],
  },
  Maize: {
    season: ["Kharif", "Rabi"],
    temp: [21, 30],
    ph: [5.8, 7.0],
    soil: ["Loamy", "Sandy"],
    humidity: [60, 75],
    rainfall_mm: [600, 1100],
  },
  Mango: {
    season: ["Zaid"],
    temp: [24, 30],
    ph: [6.5, 7.5],
    soil: ["Loamy", "Alluvial"],
    humidity: [50, 70],
    rainfall_mm: [750, 2500],
  },
  Millet: {
    season: ["Kharif"],
    temp: [25, 35],
    ph: [5.0, 6.5],
    soil: ["Sandy"],
    humidity: [40, 60],
    rainfall_mm: [350, 500],
  },
  Mustard: {
    season: ["Rabi"],
    temp: [10, 25],
    ph: [6.0, 7.5],
    soil: ["Loamy", "Sandy"],
    humidity: [50, 70],
    rainfall_mm: [350, 450],
  },
  Onion: {
    season: ["Rabi", "Kharif"],
    temp: [13, 25],
    ph: [6.0, 7.0],
    soil: ["Loamy"],
    humidity: [60, 75],
    rainfall_mm: [650, 750],
  },
  "Pigeon Pea (Arhar)": {
    season: ["Kharif"],
    temp: [25, 35],
    ph: [6.5, 7.5],
    soil: ["Loamy"],
    humidity: [50, 70],
    rainfall_mm: [600, 650],
  },
  Potato: {
    season: ["Rabi", "Zaid"],
    temp: [15, 25],
    ph: [5.0, 6.5],
    soil: ["Loamy", "Sandy"],
    humidity: [60, 80],
    rainfall_mm: [500, 750],
  },
  "Ragi (Finger Millet)": {
    season: ["Kharif"],
    temp: [20, 30],
    ph: [5.5, 7.5],
    soil: ["Red and Yellow", "Loamy"],
    humidity: [50, 70],
    rainfall_mm: [700, 1200],
  },
  Rice: {
    season: ["Kharif"],
    temp: [21, 37],
    ph: [5.0, 7.0],
    soil: ["Clayey", "Loamy"],
    humidity: [70, 90],
    rainfall_mm: [1500, 3000],
  },
  Soybean: {
    season: ["Kharif"],
    temp: [20, 30],
    ph: [6.0, 7.0],
    soil: ["Loamy"],
    humidity: [60, 70],
    rainfall_mm: [600, 1000],
  },
  Sugarcane: {
    season: ["Kharif", "Zaid"],
    temp: [20, 35],
    ph: [6.5, 7.5],
    soil: ["Loamy", "Clayey"],
    humidity: [70, 85],
    rainfall_mm: [750, 1200],
  },
  Tea: {
    season: ["Kharif"],
    temp: [20, 30],
    ph: [4.5, 5.5],
    soil: ["Forest", "Loamy"],
    humidity: [70, 90],
    rainfall_mm: [2000, 3000],
  },
  Tomato: {
    season: ["Rabi", "Zaid"],
    temp: [21, 29],
    ph: [6.0, 7.0],
    soil: ["Loamy", "Sandy"],
    humidity: [60, 80],
    rainfall_mm: [600, 800],
  },
  Turmeric: {
    season: ["Kharif"],
    temp: [20, 30],
    ph: [6.0, 7.5],
    soil: ["Loamy"],
    humidity: [70, 90],
    rainfall_mm: [1500, 2500],
  },
  Wheat: {
    season: ["Rabi"],
    temp: [10, 25],
    ph: [6.0, 7.5],
    soil: ["Loamy"],
    humidity: [50, 70],
    rainfall_mm: [300, 900],
  },
};

const TEAM_MEMBERS = [
  {
    name: "Lakshay Saini",
    role: "Team Leader",
    bio: "B.Tech Biotechnology.",
    avatar: "https://placehold.co/100x100/313b4d/ffffff?text=LS",
  },
  {
    name: "Punit Kant",
    role: "Team Member",
    bio: "B.Tech Biotechnology.",
    avatar: "https://placehold.co/100x100/313b4d/ffffff?text=PK",
  },
  {
    name: "Dhruv Kapadiya",
    role: "Team Member",
    bio: "B.Tech Biotechnology.",
    avatar: "https://placehold.co/100x100/313b4d/ffffff?text=DK",
  },
  {
    name: "Sneha Dubey",
    role: "Team Member",
    bio: "B.Tech Biotechnology.",
    avatar: "https://placehold.co/100x100/313b4d/ffffff?text=SD",
  },
  {
    name: "Harshil Patel",
    role: "Team Member",
    bio: "B.Tech Biotechnology.",
    avatar: "https://placehold.co/100x100/313b4d/ffffff?text=HP",
  },
  {
    name: "Karmjeetsinh Rathod",
    role: "Team Member",
    bio: "B.Tech Biotechnology.",
    avatar: "https://placehold.co/100x100/313b4d/ffffff?text=KR",
  },
];

// --- API Service Abstractions ---

// WMO Weather code to description and icon mapping
const wmoCodeToIcon = (wmoCode, isDay = true) => {
  const codeMap = {
    0: { desc: "Clear sky", icon: "01" },
    1: { desc: "Mainly clear", icon: "02" },
    2: { desc: "Partly cloudy", icon: "03" },
    3: { desc: "Overcast", icon: "04" },
    45: { desc: "Fog", icon: "50" },
    48: { desc: "Depositing rime fog", icon: "50" },
    51: { desc: "Light drizzle", icon: "09" },
    53: { desc: "Moderate drizzle", icon: "09" },
    55: { desc: "Dense drizzle", icon: "09" },
    56: { desc: "Light freezing drizzle", icon: "09" },
    57: { desc: "Dense freezing drizzle", icon: "09" },
    61: { desc: "Slight rain", icon: "10" },
    63: { desc: "Moderate rain", icon: "10" },
    65: { desc: "Heavy rain", icon: "10" },
    66: { desc: "Light freezing rain", icon: "13" },
    67: { desc: "Heavy freezing rain", icon: "13" },
    71: { desc: "Slight snow fall", icon: "13" },
    73: { desc: "Moderate snow fall", icon: "13" },
    75: { desc: "Heavy snow fall", icon: "13" },
    77: { desc: "Snow grains", icon: "13" },
    80: { desc: "Slight rain showers", icon: "09" },
    81: { desc: "Moderate rain showers", icon: "09" },
    82: { desc: "Violent rain showers", icon: "09" },
    85: { desc: "Slight snow showers", icon: "13" },
    86: { desc: "Heavy snow showers", icon: "13" },
    95: { desc: "Thunderstorm", icon: "11" },
    96: { desc: "Thunderstorm with slight hail", icon: "11" },
    99: { desc: "Thunderstorm with heavy hail", icon: "11" },
  };
  const mapping = codeMap[wmoCode] || { desc: "Unknown", icon: "02" };
  return {
    description: mapping.desc,
    icon: `${mapping.icon}${isDay ? "d" : "n"}`,
  };
};

const geocodeDistrict = async (district, state) => {
  // In a real app, this would use a geocoding API. Here we use fallbacks.
  console.warn("Using fallback coordinates for geocoding.");
  const stateDistrictCoords = {
    GJ: {
      Vadodara: { lat: 22.3072, lon: 73.1812 },
      Ahmedabad: { lat: 23.0225, lon: 72.5714 },
      Surat: { lat: 21.1702, lon: 72.8311 },
    },
    MH: {
      Pune: { lat: 18.5204, lon: 73.8567 },
      "Mumbai City": { lat: 19.076, lon: 72.8777 },
      Nagpur: { lat: 21.1458, lon: 79.0882 },
    },
    UP: {
      Lucknow: { lat: 26.8467, lon: 80.9462 },
      Varanasi: { lat: 25.3176, lon: 82.9739 },
      Agra: { lat: 27.1767, lon: 78.0081 },
    },
    KA: {
      "Bengaluru Urban": { lat: 12.9716, lon: 77.5946 },
      Mysuru: { lat: 12.2958, lon: 76.6394 },
    },
    AP: {
      Visakhapatnam: { lat: 17.6868, lon: 83.2185 },
      Vijayawada: { lat: 16.5062, lon: 80.648 },
    },
    TN: {
      Chennai: { lat: 13.0827, lon: 80.2707 },
      Coimbatore: { lat: 11.0168, lon: 76.9558 },
    },
  };
  return (
    stateDistrictCoords[state]?.[district] || { lat: 20.5937, lon: 78.9629 }
  ); // Default to India center
};

const fetchCurrentWeather = async (lat, lon) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,relative_humidity_2m_mean&timezone=auto`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch forecast data");
    const data = await response.json();

    const currentWeatherData = wmoCodeToIcon(data.current.weather_code);

    const dailyData = data.daily.time.map((time, index) => {
      const dailyWeatherData = wmoCodeToIcon(data.daily.weather_code[index]);
      return {
        dt: new Date(time).getTime() / 1000,
        temp: {
          min: data.daily.temperature_2m_min[index],
          max: data.daily.temperature_2m_max[index],
        },
        humidity: data.daily.relative_humidity_2m_mean[index],
        weather: [
          {
            description: dailyWeatherData.description,
            icon: dailyWeatherData.icon,
          },
        ],
      };
    });

    return {
      current: {
        temp: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        weather: [
          {
            description: currentWeatherData.description,
            icon: currentWeatherData.icon,
          },
        ],
      },
      daily: dailyData,
    };
  } catch (error) {
    console.error("Error fetching weather forecast:", error);
    return null;
  }
};

const fetchSoilData = async (lat, lon) => {
  // This is a mock function. In a real application, this would call a service like SoilGrids.
  console.log(
    `Fetching soil data for coords: ${lat}, ${lon}... (using mock data)`
  );
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate a plausible response based on coordinates to make the demo feel real.
      const ph = 6.0 + (lat % 2.5); // pseudo-random pH between 6.0 and 8.5
      const textures = [
        "Loamy",
        "Sandy",
        "Clayey",
        "Black",
        "Alluvial",
        "Red and Yellow",
      ];
      const textureIndex = Math.floor(Math.abs(lon) % textures.length);
      const texture = textures[textureIndex];
      resolve({ ph: ph.toFixed(1), texture });
    }, 750);
  });
};

const fetchHistoricalWeather = async (lat, lon, startDate, endDate) => {
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean&timezone=auto`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch historical weather");
    return await response.json();
  } catch (error) {
    console.error("Error fetching historical weather:", error);
    return null;
  }
};

const fetchMarketPrices = async (crop, district) => {
  console.log(
    `Fetching market prices for ${crop} in ${district}... (using mock data)`
  );
  return new Promise((resolve) => {
    setTimeout(() => {
      const prices = [];
      const basePrice = 4000 + ((crop.length * 100) % 1500);
      const trend = 0.5; // Slight upward trend

      for (let i = 30; i >= 0; i--) {
        const date = new Date(Date.now() - i * 86400000);
        // Simulate seasonality with a sine wave
        const seasonality =
          Math.sin((date.getMonth() * 30 + date.getDate()) / 58) * 200;
        const noise = (Math.random() - 0.5) * 300;
        const modal = basePrice + seasonality + noise + (30 - i) * trend;

        prices.push({
          date: date.toISOString().split("T")[0],
          min_price: modal * (0.9 + Math.random() * 0.05),
          max_price: modal * (1.05 + Math.random() * 0.05),
          modal_price: modal,
        });
      }
      resolve({ prices });
    }, 1000);
  });
};

// --- Helper Functions ---
const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
const getSeason = (date) => {
  const month = new Date(date).getMonth() + 1; // 1-12
  if (month >= 6 && month <= 9) return "Kharif";
  if (month >= 10 || month <= 3) return "Rabi";
  return "Zaid";
};

const chartOptions = (title) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top", labels: { color: "#cbd5e1" } },
    title: { display: true, text: title, color: "#f1f5f9", font: { size: 16 } },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { color: "#94a3b8" },
      grid: { color: "#475569" },
    },
    x: { ticks: { color: "#94a3b8" }, grid: { color: "#334155" } },
  },
});

const multiAxisChartOptions = (title, y1Label, y2Label) => ({
  ...chartOptions(title),
  scales: {
    y1: {
      type: "linear",
      display: true,
      position: "left",
      title: { display: true, text: y1Label, color: "#f87171" },
      ticks: { color: "#f87171" },
      grid: { drawOnChartArea: false },
    },
    y2: {
      type: "linear",
      display: true,
      position: "right",
      title: { display: true, text: y2Label, color: "#60a5fa" },
      ticks: { color: "#60a5fa" },
      grid: { drawOnChartArea: false },
    },
    x: chartOptions().scales.x,
  },
});

// --- UI Components ---
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);
const HariyaliIcon = ({ className = "w-7 h-7 text-green-400" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21.75V12m0 0V3.75"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.25 5.25L12 3.75 9.75 5.25"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.25 8.25L12 6.75 9.75 8.25"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.25 11.25L12 9.75 9.75 11.25"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 13.5c-2.06-2.06-3-4.5-3-4.5s2.44-1.06,4.5-3.06M15.75 13.5c2.06-2.06,3-4.5,3-4.5s-2.44-1.06-4.5-3.06"
    />
  </svg>
);
const CloudIcon = () => (
  <Icon path="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 017.5 0z" />
);
const WeatherIcon = ({ iconCode, className }) => {
  const code = iconCode?.slice(0, 2);
  const pathMap = {
    "01": "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z", // Sun
    "02": "M12 2.25a.75.75 0 01.75.75v.549a8.983 8.983 0 011.898 2.323l.42-1.042a.75.75 0 111.396.562l-2.41 5.98a.75.75 0 01-1.396-.563l.23-2.006a6.836 6.836 0 00-4.032 0l.23 2.006a.75.75 0 11-1.396.563l-2.41-5.98a.75.75 0 111.396-.562l.42 1.042A8.983 8.983 0 0111.25 3.55V3a.75.75 0 01.75-.75zM12 15a6 6 0 100-12 6 6 0 000 12z", // Few clouds
    "03": "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z", // Scattered clouds
    "04": "M18.375 12c-2.064 0-3.75-1.686-3.75-3.75 0-1.01.404-1.923 1.058-2.602-1.034-.92-2.41-1.498-3.933-1.498-3.45 0-6.25 2.8-6.25 6.25s2.8 6.25 6.25 6.25h9.5c2.07 0 3.75-1.68 3.75-3.75s-1.68-3.75-3.75-3.75h-2.875z", // Broken clouds
    "09": "M10.5 21a8.25 8.25 0 100-16.5 8.25 8.25 0 000 16.5zm3.75-11.25a.75.75 0 00-1.5 0v3a.75.75 0 001.5 0v-3z", // Shower rain
    10: "M12.75 12.75l-4.5 4.5m0-4.5l4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z", // Rain
    11: "M11.25 4.5l-1.5 6h3.75l-4.5 9v-6.75h-2.25l1.5-6h3z", // Thunderstorm
    13: "M12 21a9 9 0 100-18 9 9 0 000 18zm0 0l.53-.53m-1.06 1.06L12 21zm0 0l-.53.53m1.06-1.06l-.53-.53M9.75 11.25l-2.25 2.25h4.5l-2.25-2.25zm4.5 0l-2.25 2.25h4.5l-2.25-2.25zm0 4.5l-2.25 2.25h4.5l-2.25-2.25z", // Snow
    50: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5", // Mist
  };
  return <Icon path={pathMap[code] || pathMap["02"]} className={className} />;
};

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-slate-700 text-white text-sm rounded-md py-1 pl-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        {Object.keys(translations).map((code) => (
          <option key={code} value={code}>
            {translations[code].language_name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

const Navbar = ({ activePage, setActivePage }) => {
  const { t } = useLanguage();
  const navItems = [
    { key: "nav_home", page: "Home" },
    { key: "nav_how_it_works", page: "How it works" },
    { key: "nav_gemini_qa", page: "Gemini Q&A" },
    { key: "nav_features", page: "Features" },
    { key: "nav_faq", page: "FAQ" },
    { key: "nav_contact", page: "Contact" },
    { key: "nav_team", page: "Team" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 bg-opacity-80 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              setActivePage("Home");
            }}
            className="flex items-center cursor-pointer"
          >
            <HariyaliIcon />
            <span className="font-bold text-xl ml-2 text-green-400">
              HARIYALI
            </span>
          </a>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={`#${item.page.toLowerCase().replace(/\s/g, "-")}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActivePage(item.page);
                  }}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activePage === item.page
                      ? "bg-green-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {t(item.key)}
                </a>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            <a
              href="#login"
              onClick={(e) => {
                e.preventDefault();
                setActivePage("Login");
              }}
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              {t("nav_login")}
            </a>
            <a
              href="#register"
              onClick={(e) => {
                e.preventDefault();
                setActivePage("Register");
              }}
              className="bg-green-600 text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              {t("nav_register")}
            </a>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => alert("Mobile menu")}
              className="text-gray-300 hover:text-white"
            >
              <Icon path="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-gray-900 border-t border-gray-800 mt-16">
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
      <p>&copy; {new Date().getFullYear()} HARIYALI. All rights reserved.</p>
      <p className="mt-2">
        Data sourced from OpenWeatherMap, Open-Meteo, SoilGrids, and government
        portals like AGMARKNET/e-NAM.
      </p>
      <p className="mt-1">
        <a href="#privacy" className="hover:text-green-400">
          Privacy Policy
        </a>{" "}
        |{" "}
        <a href="#terms" className="hover:text-green-400">
          Terms of Service
        </a>
      </p>
    </div>
  </footer>
);

const Card = ({ title, icon, children }) => (
  <div className="bg-slate-800 rounded-lg shadow-xl p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] transform-gpu">
    <div className="flex items-center text-green-400 mb-4">
      {icon}
      <h3 className="text-xl font-bold ml-3 text-slate-100">{title}</h3>
    </div>
    <div className="text-slate-300">{children}</div>
  </div>
);

const ManagementRecommendations = ({ results }) => {
  const { t } = useLanguage();
  const managementData = CROP_MANAGEMENT_DATA[results.inputs.crop];
  const iconPath =
    "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z";

  if (!managementData) {
    return (
      <Card title={t("card_management_recs")} icon={<Icon path={iconPath} />}>
        <p>{t("card_no_management_data")}</p>
      </Card>
    );
  }

  return (
    <Card title={t("card_management_recs")} icon={<Icon path={iconPath} />}>
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg text-green-400 mb-2">
            {t(managementData.fertilizer.title)}
          </h4>
          <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
            {managementData.fertilizer.recommendations.map((rec, i) => (
              <li key={i}>{t(rec)}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg text-green-400 mb-2">
            {t(managementData.pest_control.title)}
          </h4>
          <div className="space-y-3">
            {managementData.pest_control.methods.map((method, i) => (
              <div key={i} className="p-3 bg-slate-700/50 rounded-lg">
                <p className="font-semibold text-slate-100">{t(method.pest)}</p>
                <p className="text-sm">{t(method.control)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

const IrrigationRecommendations = ({ results }) => {
  const { t } = useLanguage();
  const irrigationData = CROP_IRRIGATION_DATA[results.inputs.crop];
  const iconPath =
    "M8.25 6.75h7.5v7.5h-7.5v-7.5z M12 1.5a10.5 10.5 0 100 21 10.5 10.5 0 000-21z M2.25 12c0 4.142 2.686 7.64 6.375 8.795M15.375 3.205A8.966 8.966 0 0112 3a8.966 8.966 0 01-3.375.205m6.75 0a8.966 8.966 0 003.375-.205m-3.375 0a8.966 8.966 0 013.375.205m0 17.59a8.966 8.966 0 01-3.375.205m0 0a8.966 8.966 0 00-3.375-.205m6.75 0a8.966 8.966 0 003.375.205";

  if (!irrigationData) {
    return (
      <Card title={t("card_irrigation_recs")} icon={<Icon path={iconPath} />}>
        <p>{t("card_no_irrigation_data")}</p>
      </Card>
    );
  }

  return (
    <Card title={t("card_irrigation_recs")} icon={<Icon path={iconPath} />}>
      <div className="space-y-6">
        {irrigationData.critical_stages && (
          <div>
            <h4 className="font-bold text-lg text-green-400 mb-2">
              {t(irrigationData.critical_stages.title)}
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
              {irrigationData.critical_stages.stages.map((stage, i) => (
                <li key={i}>{t(stage)}</li>
              ))}
            </ul>
          </div>
        )}
        {irrigationData.general_tips && (
          <div>
            <h4 className="font-bold text-lg text-green-400 mb-2">
              {t(irrigationData.general_tips.title)}
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
              {irrigationData.general_tips.tips.map((tip, i) => (
                <li key={i}>{t(tip)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};

const PredictionForm = ({ setResults, setLoading }) => {
  const { t, getObject } = useLanguage();
  const [formData, setFormData] = useState({
    crop: "Cotton",
    state: "GJ",
    district: "Vadodara",
    area: "5",
    soilPh: "6.5",
    soilType: "Black",
    plantingDate: new Date().toISOString().split("T")[0],
  });
  const [districts, setDistricts] = useState({});
  const [error, setError] = useState("");
  const [soilSuggestion, setSoilSuggestion] = useState("");

  const cropNames = getObject("crop_names");
  const soilTypes = getObject("soil_types");
  const states = getObject("states");
  const districtData = getObject("districts");

  useEffect(() => {
    if (formData.state && districtData) {
      setDistricts(districtData[formData.state] || {});
    } else {
      setDistricts({});
    }
  }, [formData.state, districtData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "state") {
      setFormData((prev) => ({ ...prev, [name]: value, district: "" })); // Reset district on state change
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDetectSoil = async () => {
    setError("");
    setSoilSuggestion("");
    if (!formData.state || !formData.district) {
      setError(t("alert_select_state_district"));
      return;
    }

    const detectButton = document.getElementById("detect-soil-btn");
    detectButton.disabled = true;
    detectButton.textContent = "Detecting...";

    const coords = await geocodeDistrict(formData.district, formData.state);
    if (coords) {
      const soil = await fetchSoilData(coords.lat, coords.lon);
      setFormData((prev) => ({
        ...prev,
        soilPh: soil.ph,
        soilType: soil.texture,
      }));
      setSoilSuggestion(
        t("form_soil_suggestion", { ph: soil.ph, texture: soil.texture })
      );
    } else {
      setError(t("alert_no_coords"));
    }

    detectButton.disabled = false;
    detectButton.textContent = t("form_detect_soil");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (
      !formData.state ||
      !formData.district ||
      !formData.area ||
      !formData.plantingDate ||
      !formData.soilType
    ) {
      setError(t("alert_fill_fields"));
      return;
    }
    setLoading(true);
    setResults(null);

    const coords = await geocodeDistrict(formData.district, formData.state);
    if (!coords) {
      setError(t("alert_no_coords"));
      setLoading(false);
      return;
    }

    const plantingDateObj = new Date(formData.plantingDate);
    const cropInfo = CROP_DATA[formData.crop];
    const harvestDateObj = new Date(plantingDateObj);
    harvestDateObj.setDate(harvestDateObj.getDate() + cropInfo.maturityDays);

    const oneYearAgo = new Date(plantingDateObj);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const [weather, historicalWeather, marketPrices] = await Promise.all([
      fetchCurrentWeather(coords.lat, coords.lon),
      fetchHistoricalWeather(
        coords.lat,
        coords.lon,
        oneYearAgo.toISOString().split("T")[0],
        formData.plantingDate
      ),
      fetchMarketPrices(formData.crop, formData.district),
    ]);

    if (!weather || !historicalWeather) {
      setError(t("alert_weather_fail"));
      setLoading(false);
      return;
    }

    const season = getSeason(formData.plantingDate);
    const areaInAcres = parseFloat(formData.area);
    const areaInHectares = areaInAcres * 0.404686; // Conversion from Acre to Hectare

    // --- ML Model Simulation: Yield Prediction ---
    // This section simulates the output of a trained regression model.
    // A real model would be trained on vast datasets and use more complex feature interactions.
    // Here, we use a factor-based approach to demonstrate the concept.
    const idealData = CROP_SUITABILITY_DATA[formData.crop];
    let yieldModifier = 1.0;

    if (idealData && historicalWeather.daily) {
      const calculateModifier = (actual, min, max) => {
        if (actual >= min && actual <= max) return 1.1; // Bonus for being in ideal range
        const range = max - min;
        const mid = (min + max) / 2;
        const deviation = Math.abs(actual - mid);
        // Simple linear penalty for deviation outside the ideal range
        let penalty = (deviation - range / 2) / range;
        return Math.max(0.8, 1.0 - penalty); // Clamp modifier between 0.8 and 1.0
      };

      if (formData.soilPh) {
        // Only apply modifier if pH is provided
        const ph = parseFloat(formData.soilPh);
        yieldModifier *= calculateModifier(
          ph,
          idealData.ph[0],
          idealData.ph[1]
        );
      }

      const avgTemp =
        historicalWeather.daily.temperature_2m_max.reduce((a, b) => a + b, 0) /
        historicalWeather.daily.temperature_2m_max.length;
      yieldModifier *= calculateModifier(
        avgTemp,
        idealData.temp[0],
        idealData.temp[1]
      );

      const totalRainfall = historicalWeather.daily.precipitation_sum.reduce(
        (a, b) => a + b,
        0
      );
      const proratedIdealRainfall =
        (idealData.rainfall_mm[0] + idealData.rainfall_mm[1]) / 2;
      yieldModifier *= calculateModifier(
        totalRainfall,
        proratedIdealRainfall * 0.7,
        proratedIdealRainfall * 1.3
      );

      // Soil Type Modifier
      if (
        idealData.soil
          .map((s) => s.toLowerCase())
          .includes(formData.soilType.toLowerCase())
      ) {
        yieldModifier *= 1.05; // 5% bonus for ideal soil type
      }
    }

    const expectedYield =
      areaInHectares * cropInfo.baselineYield * yieldModifier;

    const soilData = { ph: formData.soilPh, texture: formData.soilType };

    setResults({
      inputs: { ...formData, cropInfo },
      yield: { expected: expectedYield.toFixed(2) },
      weather: { current: weather.current, forecast: weather.daily },
      historicalWeather,
      marketPrices,
      soilData,
      season,
      harvestWindow: {
        start: formatDate(harvestDateObj),
        end: formatDate(
          new Date(harvestDateObj).setDate(harvestDateObj.getDate() + 15)
        ),
      },
    });
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-slate-800 p-8 rounded-lg shadow-2xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label
            htmlFor="crop"
            className="block text-sm font-medium text-slate-300"
          >
            {t("form_crop_name")}
          </label>
          <select
            id="crop"
            name="crop"
            value={formData.crop}
            onChange={handleChange}
            className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-white transition-colors duration-200"
          >
            {Object.keys(cropNames).map((cropKey) => (
              <option key={cropKey} value={cropKey}>
                {cropNames[cropKey]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="area"
            className="block text-sm font-medium text-slate-300"
          >
            {t("form_area")}
          </label>
          <input
            type="number"
            name="area"
            id="area"
            value={formData.area}
            onChange={handleChange}
            required
            className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-white transition-colors duration-200"
          />
        </div>
        <div>
          <label
            htmlFor="plantingDate"
            className="block text-sm font-medium text-slate-300"
          >
            {t("form_planting_date")}
          </label>
          <input
            type="date"
            name="plantingDate"
            id="plantingDate"
            value={formData.plantingDate}
            onChange={handleChange}
            required
            max={new Date().toISOString().split("T")[0]}
            className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-white transition-colors duration-200"
          />
        </div>
        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-slate-300"
          >
            {t("form_state")}
          </label>
          <select
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-white transition-colors duration-200"
          >
            <option value="">{t("form_select_state")}</option>
            {Object.keys(states).map((stateKey) => (
              <option key={stateKey} value={stateKey}>
                {states[stateKey]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="district"
            className="block text-sm font-medium text-slate-300"
          >
            {t("form_district")}
          </label>
          <select
            id="district"
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
            disabled={!formData.state}
            className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-white disabled:bg-slate-600 transition-colors duration-200"
          >
            <option value="">{t("form_select_district")}</option>
            {Object.keys(districts).map((districtKey) => (
              <option key={districtKey} value={districtKey}>
                {districts[districtKey]}
              </option>
            ))}
          </select>
        </div>
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <label
                htmlFor="soilType"
                className="block text-sm font-medium text-slate-300"
              >
                {t("form_soil_type")}
              </label>
              <select
                id="soilType"
                name="soilType"
                value={formData.soilType}
                onChange={handleChange}
                className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-white transition-colors duration-200"
              >
                {Object.keys(soilTypes).map((typeKey) => (
                  <option key={typeKey} value={typeKey}>
                    {soilTypes[typeKey]}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <label
                htmlFor="soilPh"
                className="block text-sm font-medium text-slate-300"
              >
                {t("form_soil_ph")}
              </label>
              <input
                type="number"
                id="soilPh"
                name="soilPh"
                value={formData.soilPh}
                onChange={handleChange}
                step="0.1"
                placeholder="e.g., 6.5"
                className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-white transition-colors duration-200"
              />
            </div>
          </div>
          <div className="mt-2 text-right">
            <button
              type="button"
              id="detect-soil-btn"
              onClick={handleDetectSoil}
              className="text-sm text-green-400 hover:text-green-300 font-semibold disabled:text-slate-400 disabled:cursor-not-allowed"
            >
              {t("form_detect_soil")}
            </button>
          </div>
          {soilSuggestion && (
            <div className="mt-2 text-sm text-center bg-green-900/50 border border-green-700 text-green-300 px-3 py-2 rounded-lg">
              {soilSuggestion}
            </div>
          )}
        </div>
      </div>
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
          <p>{error}</p>
        </div>
      )}
      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
        >
          {t("form_predict_button")}
        </button>
      </div>
    </form>
  );
};

const CropRecommender = ({ results }) => {
  const { t, getObject } = useLanguage();
  const cropNames = getObject("crop_names");

  const recommendations = React.useMemo(() => {
    const { historicalWeather, soilData, season, inputs } = results;
    if (!historicalWeather || !historicalWeather.daily) return [];

    const selectedState = inputs.state;

    const avgTemp =
      historicalWeather.daily.temperature_2m_max.reduce((a, b) => a + b, 0) /
      historicalWeather.daily.temperature_2m_max.length;
    const avgHumidity =
      historicalWeather.daily.relative_humidity_2m_mean.reduce(
        (a, b) => a + b,
        0
      ) / historicalWeather.daily.relative_humidity_2m_mean.length;
    const totalRainfall = historicalWeather.daily.precipitation_sum.reduce(
      (a, b) => a + b,
      0
    );

    const stateFilteredCrops = Object.entries(CROP_SUITABILITY_DATA).filter(
      ([cropName, _]) => {
        if (CROP_STATE_SUITABILITY[cropName]) {
          return CROP_STATE_SUITABILITY[cropName].includes(selectedState);
        }
        return true; // If a crop isn't in our state list, don't filter it out.
      }
    );

    const calculatedRecommendations = stateFilteredCrops.map(
      ([cropName, ideal]) => {
        let score = 0;
        const rationale = [];

        // 1. Season
        if (ideal.season.includes(season)) {
          score++;
          rationale.push("Good season.");
        } else {
          rationale.push("Wrong season.");
        }
        // 2. Temperature
        if (avgTemp >= ideal.temp[0] && avgTemp <= ideal.temp[1]) {
          score++;
          rationale.push("Ideal temperature.");
        } else {
          rationale.push("Temp mismatch.");
        }
        // 3. pH
        if (
          soilData.ph &&
          parseFloat(soilData.ph) >= ideal.ph[0] &&
          parseFloat(soilData.ph) <= ideal.ph[1]
        ) {
          score++;
          rationale.push("Suitable pH.");
        } else if (soilData.ph) {
          rationale.push("pH mismatch.");
        } else {
          rationale.push("pH not provided.");
        }
        // 4. Soil Type
        if (
          ideal.soil
            .map((s) => s.toLowerCase())
            .includes(soilData.texture.toLowerCase())
        ) {
          score++;
          rationale.push("Good soil type.");
        } else {
          rationale.push("Soil type mismatch.");
        }
        // 5. Humidity
        if (
          avgHumidity >= ideal.humidity[0] &&
          avgHumidity <= ideal.humidity[1]
        ) {
          score++;
          rationale.push("Ideal humidity.");
        } else {
          rationale.push("Humidity mismatch.");
        }
        // 6. Rainfall
        const annualRainfall = totalRainfall;
        if (
          annualRainfall >= ideal.rainfall_mm[0] &&
          annualRainfall <= ideal.rainfall_mm[1]
        ) {
          score++;
          rationale.push("Good rainfall.");
        } else {
          rationale.push("Rainfall mismatch.");
        }

        return { name: cropName, score, rationale: rationale.join(" ") };
      }
    );

    return calculatedRecommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [results, t]);

  const recommendationChartData = {
    labels: recommendations.map((r) => cropNames[r.name] || r.name),
    datasets: [
      {
        label: t("card_suitability_score"),
        data: recommendations.map((r) => r.score),
        backgroundColor: "rgba(34, 197, 94, 0.6)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card title={t("card_crop_recs")} icon={<HariyaliIcon />}>
      <p className="mb-4 text-sm text-slate-400">
        {t("card_crop_recs_subtitle", { season: results.season })}
      </p>
      <div className="space-y-4">
        {recommendations.length > 0 ? (
          <>
            <div className="h-80">
              <Bar
                options={chartOptions(t("card_top_5_crops"))}
                data={recommendationChartData}
              />
            </div>
            <ul className="divide-y divide-slate-700">
              {recommendations.map((rec) => (
                <li key={rec.name} className="py-2">
                  <p className="font-bold text-white">
                    {cropNames[rec.name] || rec.name}{" "}
                    <span className="text-sm font-normal text-slate-300">
                      - Score: {rec.score}/6
                    </span>
                  </p>
                  <p className="text-xs text-slate-400">{rec.rationale}</p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>{t("card_no_recs")}</p>
        )}
        <div className="mt-4 text-center p-2 bg-yellow-900/50 border border-yellow-700 rounded-lg text-xs">
          <p className="text-yellow-400">{t("card_disclaimer")}</p>
        </div>
      </div>
    </Card>
  );
};

const FinancialProjections = ({ results }) => {
  const { t } = useLanguage();
  const { inputs, yield: yieldData, marketPrices } = results;
  const initialPrice =
    marketPrices.prices[marketPrices.prices.length - 1].modal_price;

  const [marketPrice, setMarketPrice] = useState(initialPrice.toFixed(2));

  const areaInAcres = parseFloat(inputs.area);
  const areaInHectares = areaInAcres * 0.404686; // Conversion from Acre to Hectare
  const expectedYieldTonnes = parseFloat(yieldData.expected);
  const costPerHectare = inputs.cropInfo.cost_per_hectare;

  const totalCost = areaInHectares * costPerHectare;
  const totalRevenue = expectedYieldTonnes * 10 * parseFloat(marketPrice || 0); // 1 Tonne = 10 Quintals
  const estimatedProfit = totalRevenue - totalCost;

  const financialChartData = {
    labels: ["Financials"],
    datasets: [
      {
        label: `${t("card_total_cost")} (₹)`,
        data: [totalCost],
        backgroundColor: "rgba(239, 68, 68, 0.7)",
      },
      {
        label: `${t("card_total_revenue")} (₹)`,
        data: [totalRevenue],
        backgroundColor: "rgba(34, 197, 94, 0.7)",
      },
    ],
  };

  return (
    <Card
      title={t("card_financials")}
      icon={
        <Icon path="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0h.75A.75.75 0 015.25 6v.75m0 0v-.75A.75.75 0 014.5 5.25h-.75M6 15a.75.75 0 100-1.5.75.75 0 000 1.5zm12.75 0a.75.75 0 100-1.5.75.75 0 000 1.5zM3.75 6.75h16.5v11.25a.75.75 0 01-.75.75h-15a.75.75 0 01-.75-.75V6.75z" />
      }
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="marketPrice"
            className="block text-sm font-medium text-slate-300"
          >
            {t("card_market_price")}
          </label>
          <input
            type="number"
            id="marketPrice"
            value={marketPrice}
            onChange={(e) => setMarketPrice(e.target.value)}
            className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-white"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-slate-700 p-3 rounded-lg">
            <h4 className="text-sm text-slate-400">{t("card_total_cost")}</h4>
            <p className="text-lg font-bold text-red-400">
              ₹{totalCost.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="bg-slate-700 p-3 rounded-lg">
            <h4 className="text-sm text-slate-400">
              {t("card_total_revenue")}
            </h4>
            <p className="text-lg font-bold text-green-400">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="bg-slate-700 p-3 rounded-lg col-span-2">
            <h4 className="text-sm text-slate-400">
              {t("card_estimated_profit")}
            </h4>
            <p
              className={`text-2xl font-bold ${
                estimatedProfit >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              ₹{estimatedProfit.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
        <div className="h-64 mt-4">
          <Bar
            options={{
              ...chartOptions(t("card_profitability_breakdown")),
              scales: {
                x: { ...chartOptions().scales.x },
                y: {
                  ...chartOptions().scales.y,
                  ticks: {
                    ...chartOptions().scales.y.ticks,
                    callback: (value) => `₹${value / 1000}k`,
                  },
                },
              },
            }}
            data={financialChartData}
          />
        </div>
      </div>
    </Card>
  );
};

const WeeklyForecast = ({ results }) => {
  const { t } = useLanguage();
  const { weather, inputs } = results;
  const forecastDays = weather.forecast.slice(1, 8); // Next 7 days

  const idealConditions = CROP_SUITABILITY_DATA[inputs.crop];
  let plantingSuitability = { suitable: true, reasons: [] };

  if (idealConditions) {
    const plantingWindowForecast = weather.forecast.slice(1, 4); // Check next 3 days
    const avgMaxTemp =
      plantingWindowForecast.reduce((sum, day) => sum + day.temp.max, 0) / 3;
    const avgHumidity =
      plantingWindowForecast.reduce((sum, day) => sum + day.humidity, 0) / 3;

    if (avgMaxTemp > idealConditions.temp[1])
      plantingSuitability.reasons.push(t("reason_temp_high"));
    if (avgMaxTemp < idealConditions.temp[0])
      plantingSuitability.reasons.push(t("reason_temp_low"));
    if (avgHumidity > idealConditions.humidity[1])
      plantingSuitability.reasons.push(t("reason_humidity_high"));
    if (avgHumidity < idealConditions.humidity[0])
      plantingSuitability.reasons.push(t("reason_humidity_low"));

    if (plantingSuitability.reasons.length > 0) {
      plantingSuitability.suitable = false;
    }
  }

  return (
    <Card title={t("card_weekly_forecast")} icon={<CloudIcon />}>
      <div className="mb-4 p-4 rounded-lg bg-slate-700">
        <h4 className="font-bold text-lg text-slate-100">
          {t("planting_suitability_title")}
        </h4>
        <div
          className={`mt-2 flex items-center ${
            plantingSuitability.suitable ? "text-green-400" : "text-red-400"
          }`}
        >
          <Icon
            path={
              plantingSuitability.suitable
                ? "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                : "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            }
            className="w-6 h-6 mr-2"
          />
          <p className="font-semibold">
            {plantingSuitability.suitable
              ? t("planting_suitable_true")
              : t("planting_suitable_false")}
          </p>
        </div>
        {!plantingSuitability.suitable && (
          <p className="text-sm text-slate-400 mt-1 ml-8">
            {plantingSuitability.reasons.join(", ")}.
          </p>
        )}
      </div>
      <ul className="space-y-2">
        {forecastDays.map((day, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-2 bg-slate-700 rounded-md"
          >
            <p className="font-semibold w-1/4">
              {new Date(day.dt * 1000).toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
              })}
            </p>
            <div className="flex items-center w-1/4">
              <WeatherIcon
                iconCode={day.weather[0].icon}
                className="w-8 h-8 text-yellow-300"
              />
            </div>
            <p className="w-1/4 text-center">
              {Math.round(day.temp.max)}° / {Math.round(day.temp.min)}°C
            </p>
            <p className="w-1/4 text-right text-blue-300">
              {Math.round(day.humidity)}%
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
};

const ResultsDisplay = ({ results }) => {
  const { t, getObject } = useLanguage();
  const cropNames = getObject("crop_names");
  const soilTypes = getObject("soil_types");
  const translatedCropName =
    cropNames[results.inputs.crop] || results.inputs.crop;
  const translatedSoilType =
    soilTypes[results.soilData.texture] || results.soilData.texture;

  const historicalWeatherChartData = {
    labels: results.historicalWeather.daily.time,
    datasets: [
      {
        label: "Max Temp (°C)",
        data: results.historicalWeather.daily.temperature_2m_max,
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.5)",
        yAxisID: "y1",
      },
      {
        label: "Mean Humidity (%)",
        data: results.historicalWeather.daily.relative_humidity_2m_mean,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        yAxisID: "y2",
      },
    ],
  };

  const marketPriceChartData = {
    labels: results.marketPrices.prices.map((p) => p.date),
    datasets: [
      {
        label: t("card_market_trends_min"),
        data: results.marketPrices.prices.map((p) => p.min_price),
        borderColor: "rgb(239, 68, 68)",
      },
      {
        label: t("card_market_trends_modal"),
        data: results.marketPrices.prices.map((p) => p.modal_price),
        borderColor: "rgb(34, 197, 94)",
      },
      {
        label: t("card_market_trends_max"),
        data: results.marketPrices.prices.map((p) => p.max_price),
        borderColor: "rgb(59, 130, 246)",
      },
    ],
  };

  const resultCards = [
    { id: "weekly_forecast", component: <WeeklyForecast results={results} /> },
    {
      id: "crop_recommender",
      component: <CropRecommender results={results} />,
    },
    {
      id: "financial_projections",
      component: <FinancialProjections results={results} />,
    },
    {
      id: "market_trends",
      component: (
        <Card
          title={t("card_market_trends")}
          icon={
            <Icon path="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.517l2.74-1.22m0 0l-3.75-2.25M21 18v-6" />
          }
        >
          <div className="h-80">
            <Line
              options={chartOptions(t("card_price_per_quintal"))}
              data={marketPriceChartData}
            />
          </div>
        </Card>
      ),
    },
    {
      id: "historical_weather",
      component: (
        <Card title={t("card_historical_weather")} icon={<CloudIcon />}>
          <div className="h-80">
            <Line
              options={multiAxisChartOptions(
                t("card_temp_humidity"),
                "Temperature (°C)",
                "Humidity (%)"
              )}
              data={historicalWeatherChartData}
            />
          </div>
        </Card>
      ),
    },
    {
      id: "management_recs",
      component: <ManagementRecommendations results={results} />,
    },
    {
      id: "irrigation_recs",
      component: <IrrigationRecommendations results={results} />,
    },
  ];

  return (
    <div className="mt-12 space-y-8">
      <h2
        className="text-3xl font-bold text-center text-white mb-8 animate-fadeInUp"
        style={{ opacity: 0 }}
      >
        {t("results_analysis_for", {
          crop: translatedCropName,
          district: results.inputs.district,
        })}
      </h2>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-white text-center animate-fadeInUp"
        style={{ animationDelay: "0.2s", opacity: 0 }}
      >
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-green-400">
            {t("results_expected_yield")}
          </h3>
          <p className="text-4xl font-bold mt-2 animate-pulse-grow">
            {results.yield.expected}
          </p>
          <p className="text-slate-400">{t("results_tonnes")}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-green-400">
            {t("results_harvest_window")}
          </h3>
          <p className="text-2xl font-bold mt-2">
            {results.harvestWindow.start}
          </p>
          <p className="text-slate-400">
            {t("results_to")} {results.harvestWindow.end}
          </p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-green-400">
            {t("results_weather_now")}
          </h3>
          <p className="text-2xl font-bold mt-2">
            {results.weather.current.temp}°C /{" "}
            {results.weather.current.humidity}%
          </p>
          <p className="text-slate-400 capitalize">
            {results.weather.current.weather[0].description}
          </p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-green-400">
            {t("results_soil_details")}
          </h3>
          <p className="text-2xl font-bold mt-2">pH {results.soilData.ph}</p>
          <p className="text-slate-400 capitalize">{translatedSoilType}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {resultCards.map((card, index) => (
          <div
            key={card.id}
            className="animate-fadeInUp"
            style={{ opacity: 0, animationDelay: `${0.4 + index * 0.1}s` }}
          >
            {card.component}
          </div>
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  const { t } = useLanguage();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (results && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [results]);

  return (
    <div>
      <div className="text-center pt-16 pb-12 px-4 overflow-hidden">
        <h1
          className="text-4xl md:text-5xl font-extrabold text-white tracking-tight animate-fadeInUp"
          style={{ animationDelay: "0.1s", opacity: 0 }}
        >
          {t("hero_title_1")}
          <span className="block text-green-400 text-3xl md:text-4xl">
            {t("hero_title_2")}
          </span>
        </h1>
        <p
          className="mt-4 max-w-2xl mx-auto text-lg text-slate-300 animate-fadeInUp"
          style={{ animationDelay: "0.3s", opacity: 0 }}
        >
          {t("hero_subtitle")}
        </p>
        <div
          className="mt-8 animate-fadeInUp"
          style={{ animationDelay: "0.5s", opacity: 0 }}
        >
          <button
            onClick={() =>
              document
                .getElementById("prediction-form")
                .scrollIntoView({ behavior: "smooth" })
            }
            className="bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition-all duration-300 text-lg shadow-lg active:scale-95"
          >
            {t("hero_get_started")}
          </button>
        </div>
      </div>

      <div
        id="prediction-form"
        className="max-w-5xl mx-auto px-4 space-y-4 animate-fadeInUp"
        style={{ opacity: 0, animationDelay: "0.6s" }}
      >
        {isFormVisible ? (
          <PredictionForm setResults={setResults} setLoading={setLoading} />
        ) : (
          <div className="bg-slate-800 rounded-lg shadow-2xl p-8 text-center">
            <HariyaliIcon className="w-16 h-16 mx-auto text-green-500" />
            <h2 className="mt-4 text-3xl font-bold text-white">
              {t("prediction_card_title")}
            </h2>
            <p className="mt-2 max-w-2xl mx-auto text-slate-300">
              {t("prediction_card_desc")}
            </p>
            <button
              onClick={() => setIsFormVisible(true)}
              className="mt-6 bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition-all duration-300 text-lg shadow-lg active:scale-95"
            >
              {t("prediction_card_button")}
            </button>
          </div>
        )}
      </div>

      <div ref={resultsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading && (
          <div className="text-center py-12 animate-fadeInUp">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto"></div>
            <p className="mt-4 text-slate-300 animate-pulse">
              {t("loading_text")}
            </p>
          </div>
        )}
        {results && <ResultsDisplay results={results} />}
      </div>
    </div>
  );
};

const ContentPage = ({ titleKey, children }) => {
  const { t } = useLanguage();
  return (
    <div
      className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-slate-300 animate-fadeInUp"
      style={{ opacity: 0 }}
    >
      <h1 className="text-4xl font-bold text-white text-center mb-12">
        {t(titleKey)}
      </h1>
      <div className="prose prose-invert prose-lg max-w-none space-y-6">
        {children}
      </div>
    </div>
  );
};

const HowItWorksPage = () => {
  const { t } = useLanguage();
  return (
    <ContentPage titleKey="how_it_works_title">
      <p>{t("how_it_works_p1")}</p>
      <ol>
        <li>{t("how_it_works_l1")}</li>
        <li>{t("how_it_works_l2")}</li>
        <li>{t("how_it_works_l3")}</li>
        <li>{t("how_it_works_l4")}</li>
        <li>{t("how_it_works_l5")}</li>
        <li>{t("how_it_works_l6")}</li>
        <li>{t("how_it_works_l7")}</li>
      </ol>
    </ContentPage>
  );
};

const FeaturesPage = () => {
  const { t } = useLanguage();
  const features = [
    { title: "features_f1_title", text: "features_f1_text" },
    { title: "features_f2_title", text: "features_f2_text" },
    { title: "features_f3_title", text: "features_f3_text" },
    { title: "features_f4_title", text: "features_f4_text" },
    { title: "features_f5_title", text: "features_f5_text" },
    { title: "features_f6_title", text: "features_f6_text" },
  ];
  return (
    <ContentPage titleKey="features_title">
      <div className="grid md:grid-cols-2 gap-8">
        {features.map((f) => (
          <div key={f.title} className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-green-400 mb-2">
              {t(f.title)}
            </h3>
            <p>{t(f.text)}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center p-4 bg-yellow-900/50 border border-yellow-700 rounded-lg">
        <h4 className="font-bold text-yellow-300">
          {t("features_note_title")}
        </h4>
        <p className="text-yellow-400">{t("features_note_text")}</p>
      </div>
    </ContentPage>
  );
};

const FAQPage = () => {
  const { t } = useLanguage();
  const faqs = [
    { q: "faq_q1_title", a: "faq_q1_text" },
    { q: "faq_q2_title", a: "faq_q2_text" },
    { q: "faq_q3_title", a: "faq_q3_text" },
    { q: "faq_q4_title", a: "faq_q4_text" },
  ];
  return (
    <ContentPage titleKey="faq_title">
      <div className="space-y-8">
        {faqs.map((f) => (
          <div key={f.q}>
            <h3 className="text-xl font-semibold text-green-400">{t(f.q)}</h3>
            <p>{t(f.a)}</p>
          </div>
        ))}
      </div>
    </ContentPage>
  );
};

const TeamPage = () => {
  const { t } = useLanguage();
  return (
    <ContentPage titleKey="team_title">
      <p className="text-center">{t("team_subtitle")}</p>
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {TEAM_MEMBERS.map((member) => (
          <div
            key={member.name}
            className="bg-slate-800 p-6 rounded-lg text-center shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-green-500/20 transform-gpu"
          >
            <img
              src={member.avatar}
              alt={member.name}
              className="w-24 h-24 mx-auto rounded-full mb-4 ring-2 ring-green-500"
            />
            <h3 className="text-xl font-bold text-white">{member.name}</h3>
            <p className="text-green-400 font-semibold">{member.role}</p>
            <p className="mt-2 text-slate-400 text-sm">{member.bio}</p>
          </div>
        ))}
      </div>
    </ContentPage>
  );
};

const ContactPage = () => {
  const { t } = useLanguage();
  return (
    <ContentPage titleKey="contact_title">
      <p className="text-center mb-8">{t("contact_subtitle")}</p>
      <form
        className="max-w-xl mx-auto space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          alert(t("contact_alert"));
        }}
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-300"
          >
            {t("contact_name")}
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-white"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-300"
          >
            {t("contact_email")}
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-white"
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-slate-300"
          >
            {t("contact_message")}
          </label>
          <textarea
            name="message"
            id="message"
            rows="4"
            required
            className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-white"
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 active:scale-95 transition-transform"
          >
            {t("contact_send")}
          </button>
        </div>
      </form>
    </ContentPage>
  );
};

const GeminiChatPage = () => {
  const { t } = useLanguage();
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    setHistory([{ role: "model", text: t("gemini_welcome") }]);
  }, [t]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [history]);

  const callGeminiAPI = useCallback(
    async (userPrompt) => {
      setLoading(true);

      setHistory((prev) => [...prev, { role: "user", text: userPrompt }]);
      setInput("");

      const systemPrompt =
        "You are an expert agricultural assistant. Your name is Agrivisor. Provide concise, helpful, and accurate information related to farming, crop science, and market trends. If you don't know an answer, say so. Format your answers clearly, using lists or bold text where appropriate.";
      const apiKey = API_KEYS.GEMINI;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

      const chatHistoryForAPI = history.slice(1).map((msg) => ({
        // Exclude welcome message
        role: msg.role,
        parts: [{ text: msg.text }],
      }));

      const payload = {
        contents: [
          ...chatHistoryForAPI,
          { role: "user", parts: [{ text: userPrompt }] },
        ],
        systemInstruction: { parts: [{ text: systemPrompt }] },
      };

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errorBody = await response.json();
          console.error("Gemini API Error:", errorBody);
          throw new Error(`API Error: ${errorBody.error.message}`);
        }

        const result = await response.json();
        const modelResponse =
          result.candidates?.[0]?.content?.parts?.[0]?.text ||
          t("gemini_no_response");
        setHistory((prev) => [...prev, { role: "model", text: modelResponse }]);
      } catch (error) {
        console.error(error);
        setHistory((prev) => [
          ...prev,
          { role: "model", text: t("gemini_error", { error: error.message }) },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [history, t]
  );

  const handleSend = () => {
    if (input.trim()) {
      callGeminiAPI(input.trim());
    }
  };

  const UserIcon = () => (
    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-bold text-white text-sm">
      You
    </div>
  );
  const ModelIcon = () => (
    <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
      <HariyaliIcon className="w-5 h-5 text-green-400" />
    </div>
  );

  return (
    <ContentPage titleKey="gemini_title">
      <p className="text-center -mt-8 mb-8">{t("gemini_subtitle")}</p>
      <div className="bg-slate-800 rounded-lg shadow-xl flex flex-col h-[70vh]">
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {history.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              {msg.role === "user" ? <UserIcon /> : <ModelIcon />}
              <div
                className={`max-w-lg p-4 rounded-lg shadow-md ${
                  msg.role === "user"
                    ? "bg-green-600 text-white rounded-br-none"
                    : "bg-slate-700 text-slate-200 rounded-bl-none"
                }`}
              >
                <p
                  className="prose prose-invert max-w-none"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {msg.text}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-3">
              <ModelIcon />
              <div className="max-w-lg p-4 rounded-lg bg-slate-700 text-slate-200 rounded-bl-none">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="p-4 border-t border-slate-700 flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !loading && handleSend()}
            placeholder={t("gemini_placeholder")}
            className="flex-1 bg-slate-700 border-slate-600 rounded-l-md py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-white"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700 disabled:bg-slate-500"
          >
            <Icon
              path="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              className="w-5 h-5"
            />
          </button>
        </div>
      </div>
    </ContentPage>
  );
};

const LoginPage = ({ setActivePage }) => {
  const { t } = useLanguage();
  return (
    <ContentPage titleKey="login_page_title">
      <div className="max-w-md mx-auto bg-slate-800 p-8 rounded-lg shadow-xl">
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Login successful (prototype)");
            setActivePage("Home");
          }}
        >
          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-slate-300"
            >
              {t("login_email")}
            </label>
            <input
              type="email"
              name="email"
              id="login-email"
              required
              className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-white"
            />
          </div>
          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-slate-300"
            >
              {t("login_password")}
            </label>
            <input
              type="password"
              name="password"
              id="login-password"
              required
              className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-white"
            />
          </div>
          <div className="text-right text-sm">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="font-medium text-green-500 hover:text-green-400"
            >
              {t("login_forgot_password")}
            </a>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 active:scale-95 transition-transform"
            >
              {t("login_button")}
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          {t("login_no_account")}{" "}
          <a
            href="#register"
            onClick={(e) => {
              e.preventDefault();
              setActivePage("Register");
            }}
            className="font-medium text-green-500 hover:text-green-400"
          >
            {t("login_signup_link")}
          </a>
        </p>
      </div>
    </ContentPage>
  );
};

const RegisterPage = ({ setActivePage }) => {
  const { t } = useLanguage();
  return (
    <ContentPage titleKey="register_page_title">
      <div className="max-w-md mx-auto bg-slate-800 p-8 rounded-lg shadow-xl">
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Registration successful (prototype)");
            setActivePage("Home");
          }}
        >
          <div>
            <label
              htmlFor="register-name"
              className="block text-sm font-medium text-slate-300"
            >
              {t("register_name")}
            </label>
            <input
              type="text"
              name="name"
              id="register-name"
              required
              className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-white"
            />
          </div>
          <div>
            <label
              htmlFor="register-email"
              className="block text-sm font-medium text-slate-300"
            >
              {t("register_email")}
            </label>
            <input
              type="email"
              name="email"
              id="register-email"
              required
              className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-white"
            />
          </div>
          <div>
            <label
              htmlFor="register-password"
              className="block text-sm font-medium text-slate-300"
            >
              {t("register_password")}
            </label>
            <input
              type="password"
              name="password"
              id="register-password"
              required
              className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-white"
            />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-slate-300"
            >
              {t("register_confirm_password")}
            </label>
            <input
              type="password"
              name="confirm-password"
              id="confirm-password"
              required
              className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-white"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 active:scale-95 transition-transform"
            >
              {t("register_button")}
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          {t("register_has_account")}{" "}
          <a
            href="#login"
            onClick={(e) => {
              e.preventDefault();
              setActivePage("Login");
            }}
            className="font-medium text-green-500 hover:text-green-400"
          >
            {t("register_login_link")}
          </a>
        </p>
      </div>
    </ContentPage>
  );
};

// --- Main App Component ---
export default function App() {
  const [activePage, setActivePage] = useState("Home");
  const [language, setLanguage] = useState("en");

  const t = useCallback(
    (key, replacements = {}) => {
      let translation =
        translations[language]?.[key] || translations["en"]?.[key] || key;
      if (typeof translation !== "string") return translation; // Return objects directly
      for (const placeholder in replacements) {
        translation = translation.replace(
          `{${placeholder}}`,
          replacements[placeholder]
        );
      }
      return translation;
    },
    [language]
  );

  const getObject = useCallback(
    (key) => {
      return translations[language]?.[key] || translations["en"]?.[key];
    },
    [language]
  );

  const value = { language, setLanguage, t, getObject };

  const animationStyles = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        @keyframes pulse-grow {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
        .animate-fadeInUp {
            animation: fadeInUp 0.7s ease-out forwards;
        }
        .animate-pulse-grow {
            animation: pulse-grow 2s ease-in-out infinite;
        }
    `;

  const renderPage = () => {
    switch (activePage) {
      case "Home":
        return <HomePage />;
      case "How it works":
        return <HowItWorksPage />;
      case "Features":
        return <FeaturesPage />;
      case "FAQ":
        return <FAQPage />;
      case "Team":
        return <TeamPage />;
      case "Contact":
        return <ContactPage />;
      case "Gemini Q&A":
        return <GeminiChatPage />;
      case "Login":
        return <LoginPage setActivePage={setActivePage} />;
      case "Register":
        return <RegisterPage setActivePage={setActivePage} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <LanguageContext.Provider value={value}>
      <style>{animationStyles}</style>
      <div className="bg-gradient-to-br from-slate-900 to-gray-900 min-h-screen font-sans text-slate-200">
        <Navbar activePage={activePage} setActivePage={setActivePage} />
        <main>{renderPage()}</main>
        <Footer />
      </div>
    </LanguageContext.Provider>
  );
}
