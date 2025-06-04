import React, { useState, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import FormField from './components/FormField';
import SelectField from './components/SelectField'; // New component for dropdowns
import { PromptData, PromptDataKey, SelectOption } from './types';
import CopyIcon from './components/icons/CopyIcon';

const initialPromptData: PromptData = {
  subject: '',
  action: '',
  expression: '',
  place: '',
  time: '',
  cameraMovement: '',
  lighting: '',
  videoStyle: '',
  videoMood: '',
  soundMusic: '',
  spokenWords: '',
  additionalDetails: '',
};

const timeOptions: SelectOption[] = [
  { value: '', label: 'Pilih Waktu...' },
  { value: 'Siang hari cerah', label: 'Siang hari cerah (Bright Daylight)' },
  { value: 'Malam berbintang', label: 'Malam berbintang (Starry Night)' },
  { value: 'Matahari terbit', label: 'Matahari terbit (Sunrise)' },
  { value: 'Matahari terbenam', label: 'Matahari terbenam (Sunset)' },
  { value: 'Golden hour', label: 'Golden hour (Jam Emas)' },
  { value: 'Blue hour', label: 'Blue hour (Jam Biru)' },
  { value: 'Tengah malam', label: 'Tengah malam (Midnight)' },
  { value: 'Senja', label: 'Senja (Twilight)' },
];

const cameraMovementOptions: SelectOption[] = [
  { value: '', label: 'Pilih Gerakan Kamera...' },
  { value: 'Static Shot', label: 'Static Shot (Bidikan Statis)' },
  { value: 'Pan Left', label: 'Pan Left (Geser Kiri)' },
  { value: 'Pan Right', label: 'Pan Right (Geser Kanan)' },
  { value: 'Tilt Up', label: 'Tilt Up (Miring ke Atas)' },
  { value: 'Tilt Down', label: 'Tilt Down (Miring ke Bawah)' },
  { value: 'Zoom In', label: 'Zoom In (Perbesar)' },
  { value: 'Zoom Out', label: 'Zoom Out (Perkecil)' },
  { value: 'Dolly In', label: 'Dolly In (Maju Mendekat)' },
  { value: 'Dolly Out', label: 'Dolly Out (Mundur Menjauh)' },
  { value: 'Truck Left', label: 'Truck Left (Geser Kamera Kiri)' },
  { value: 'Truck Right', label: 'Truck Right (Geser Kamera Kanan)' },
  { value: 'Pedestal Up', label: 'Pedestal Up (Kamera Naik)' },
  { value: 'Pedestal Down', label: 'Pedestal Down (Kamera Turun)' },
  { value: 'Tracking Shot', label: 'Tracking Shot (Bidikan Mengikuti)' },
  { value: 'Arc Shot Left', label: 'Arc Shot Left (Bidikan Busur Kiri)' },
  { value: 'Arc Shot Right', label: 'Arc Shot Right (Bidikan Busur Kanan)' },
  { value: 'Crane Shot Up', label: 'Crane Shot Up (Bidikan Derek Naik)' },
  { value: 'Crane Shot Down', label: 'Crane Shot Down (Bidikan Derek Turun)' },
  { value: 'Drone Shot', label: 'Drone Shot (Bidikan Drone)' },
  { value: 'Fly-through', label: 'Fly-through (Terbang Menembus)' },
  { value: 'Orbit Clockwise', label: 'Orbit Clockwise (Mengorbit Searah Jarum Jam)' },
  { value: 'Orbit Counter-Clockwise', label: 'Orbit Counter-Clockwise (Mengorbit Berlawanan Jarum Jam)' },
  { value: 'POV Shot', label: 'POV Shot (Bidikan Sudut Pandang)' },
  { value: 'Handheld Shot', label: 'Handheld Shot (Bidikan Genggam)' },
  { value: 'Dutch Angle Left', label: 'Dutch Angle Left (Sudut Miring Kiri)' },
  { value: 'Dutch Angle Right', label: 'Dutch Angle Right (Sudut Miring Kanan)' },
  { value: 'Whip Pan', label: 'Whip Pan (Geser Cepat)' },
  { value: 'Crash Zoom', label: 'Crash Zoom (Zoom Cepat)' },
  { value: 'Slow Motion', label: 'Slow Motion (Gerak Lambat)' },
  { value: 'Time-lapse', label: 'Time-lapse (Selang Waktu)' },
  { value: '3D Rotation X-axis', label: '3D Rotation X-axis (Rotasi 3D Sumbu X)' },
  { value: '3D Rotation Y-axis', label: '3D Rotation Y-axis (Rotasi 3D Sumbu Y)' },
  { value: '3D Rotation Z-axis', label: '3D Rotation Z-axis (Rotasi 3D Sumbu Z)' },
  { value: 'Spiral In', label: 'Spiral In (Spiral Masuk)' },
  { value: 'Spiral Out', label: 'Spiral Out (Spiral Keluar)' },
];

const lightingOptions: SelectOption[] = [
  { value: '', label: 'Pilih Pencahayaan...' },
  { value: 'Natural Light', label: 'Natural Light (Cahaya Alami)' },
  { value: 'Studio Light', label: 'Studio Light (Cahaya Studio)' },
  { value: 'Cinematic Lighting', label: 'Cinematic Lighting (Pencahayaan Sinematik)' },
  { value: 'Dramatic Lighting', label: 'Dramatic Lighting (Pencahayaan Dramatis)' },
  { value: 'Soft Light', label: 'Soft Light (Cahaya Lembut)' },
  { value: 'Hard Light', label: 'Hard Light (Cahaya Keras)' },
  { value: 'Backlight', label: 'Backlight (Cahaya Belakang)' },
  { value: 'Rim Light', label: 'Rim Light (Cahaya Tepi)' },
  { value: 'Volumetric Lighting', label: 'Volumetric Lighting (Pencahayaan Volumetrik)' },
  { value: 'Neon Glow', label: 'Neon Glow (Sinar Neon)' },
  { value: 'Ambient Occlusion', label: 'Ambient Occlusion (Oklusi Ambien)' },
];

const videoStyleOptions: SelectOption[] = [
  { value: '', label: 'Pilih Gaya Video...' },
  { value: 'Photorealistic', label: 'Photorealistic (Fotorealistik)' },
  { value: 'Cinematic', label: 'Cinematic (Sinematik)' },
  { value: 'Anime', label: 'Anime (Anime)' },
  { value: 'Cartoon', label: 'Cartoon (Kartun)' },
  { value: 'Watercolor', label: 'Watercolor (Cat Air)' },
  { value: 'Oil Painting', label: 'Oil Painting (Lukisan Cat Minyak)' },
  { value: '3D Render', label: '3D Render (Render 3D)' },
  { value: 'Pixel Art', label: 'Pixel Art (Seni Piksel)' },
  { value: 'Vintage Film', label: 'Vintage Film (Film Antik)' },
  { value: 'Documentary', label: 'Documentary (Dokumenter)' },
  { value: 'Abstract', label: 'Abstract (Abstrak)' },
  { value: 'Surreal', label: 'Surreal (Surealis)' },
  { value: 'Cyberpunk', label: 'Cyberpunk (Cyberpunk)' },
  { value: 'Steampunk', label: 'Steampunk (Steampunk)' },
  { value: 'Fantasy Art', label: 'Fantasy Art (Seni Fantasi)' },
];

const videoMoodOptions: SelectOption[] = [
  { value: '', label: 'Pilih Suasana Video...' },
  { value: 'Joyful', label: 'Joyful (Gembira)' },
  { value: 'Sad', label: 'Sad (Sedih)' },
  { value: 'Mysterious', label: 'Mysterious (Misterius)' },
  { value: 'Suspenseful', label: 'Suspenseful (Menegangkan)' },
  { value: 'Romantic', label: 'Romantic (Romantis)' },
  { value: 'Epic', label: 'Epic (Epik)' },
  { value: 'Calm', label: 'Calm (Tenang)' },
  { value: 'Energetic', label: 'Energetic (Energik)' },
  { value: 'Horror', label: 'Horror (Horor)' },
  { value: 'Comedic', label: 'Comedic (Komedik)' },
  { value: 'Nostalgic', label: 'Nostalgic (Nostalgia)' },
  { value: 'Whimsical', label: 'Whimsical (Aneh/Jenaka)' },
  { value: 'Dreamy', label: 'Dreamy (Seperti Mimpi)' },
  { value: 'Intense', label: 'Intense (Intens)' },
];

const App: React.FC = () => {
  const [promptData, setPromptData] = useState<PromptData>(initialPromptData);
  const [generatedIndonesianPrompt, setGeneratedIndonesianPrompt] = useState<string>('');
  const [generatedEnglishPrompt, setGeneratedEnglishPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

  const handleInputChange = useCallback((field: PromptDataKey, value: string) => {
    setPromptData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleCopy = async (textToCopy: string, id: string) => {
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Gagal menyalin teks. Silakan coba lagi atau salin secara manual.');
    }
  };

  const generateVeoPrompt = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setGeneratedIndonesianPrompt('');
    setGeneratedEnglishPrompt('');

    const {
      subject, action, expression, place, time, cameraMovement,
      lighting, videoStyle, videoMood, soundMusic, spokenWords, additionalDetails
    } = promptData;

    const elementsForIndonesianPrompt = [
      subject && `Subjek: ${subject}`,
      action && `Aksi: ${action}`,
      expression && `Ekspresi: ${expression}`,
      place && `Tempat: ${place}`,
      time && `Waktu: ${time}`,
      cameraMovement && `Gerakan Kamera: ${cameraMovement}`,
      lighting && `Pencahayaan: ${lighting}`,
      videoStyle && `Gaya Video: ${videoStyle}`,
      videoMood && `Suasana Video: ${videoMood}`,
      soundMusic && `Suara/Musik: ${soundMusic}`,
      additionalDetails && `Detail Tambahan: ${additionalDetails}`
    ].filter(Boolean).join('\n*   ');

    const indonesianGenerationPrompt = `Anda adalah asisten pembuatan prompt video AI yang sangat kreatif. Berdasarkan elemen-elemen berikut, buatlah deskripsi prompt video yang kaya, mendetail, dan menggugah dalam Bahasa Indonesia. Prompt ini ditujukan untuk model AI generator video seperti Veo 3.
Struktur output yang Anda berikan HARUS terdiri dari dua bagian:
1.  **Deskripsi Naratif:** (Gabungkan semua elemen yang diberikan menjadi paragraf naratif yang hidup, puitis jika sesuai, dan menyertakan detail sensorik. JANGAN sertakan 'Kalimat yang diucapkan' di bagian ini.)
2.  **Kalimat yang diucapkan:** (HANYA tuliskan kembali teks dari input 'Kalimat yang diucapkan'. Jika input 'Kalimat yang diucapkan' kosong, tulis "Tidak ada.")

Berikut adalah elemen-elemennya:
*   ${elementsForIndonesianPrompt}
Kalimat yang diucapkan (input asli): "${spokenWords || 'Tidak ada'}"

Contoh output jika ada kalimat yang diucapkan:
Deskripsi Naratif: Seorang ksatria pemberani dengan ekspresi tegang berdiri di puncak gunung berapi yang aktif saat senja. Lava pijar mengalir di kejauhan. Kamera melakukan drone shot yang perlahan menjauh, menampakkan skala kehancuran. Pencahayaan dramatis dari lava dan langit senja. Gaya videonya epik fantasi dengan suasana mencekam. Terdengar musik orkestra yang megah dan suara gemuruh gunung.
Kalimat yang diucapkan: "Aku harus menghentikan ini!"

Contoh output jika TIDAK ADA kalimat yang diucapkan:
Deskripsi Naratif: Seekor rubah kecil yang penasaran dengan bulu oranye cerah menjelajahi hutan ajaib di bawah cahaya bulan purnama. Jamur-jamur berpendar menerangi jalannya. Kamera mengikuti rubah dari sudut rendah (low angle tracking shot). Gaya visualnya adalah fantasi dongeng dengan suasana magis dan tenang. Terdengar musik instrumental yang lembut dan suara alam malam.
Kalimat yang diucapkan: Tidak ada.

Pastikan output Anda mengikuti format ini dengan tepat. Bagian "Deskripsi Naratif:" dan "Kalimat yang diucapkan:" harus ada.
`;

    try {
      const indoResponse: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: indonesianGenerationPrompt,
      });
      
      const indoText = indoResponse.text;
      let narrativeIndo = "";
      let spokenIndo = spokenWords || ""; // Default to original spokenWords

      const narrativeMatch = indoText.match(/Deskripsi Naratif:([\s\S]*?)(Kalimat yang diucapkan:|$)/i);
      if (narrativeMatch && narrativeMatch[1]) {
        narrativeIndo = narrativeMatch[1].trim();
      } else {
        // Fallback if parsing fails, try to use the whole text as narrative if no spoken words were input
        narrativeIndo = !spokenWords ? indoText.trim() : "Gagal memproses narasi dari AI.";
      }
      
      // Reconstruct Indonesian prompt for display
      let fullIndonesianPrompt = narrativeIndo;
      if (spokenWords) {
        fullIndonesianPrompt += `\n\nKalimat yang diucapkan: "${spokenWords}"`;
      }
      setGeneratedIndonesianPrompt(fullIndonesianPrompt);

      // Prepare for English translation (only narrative part)
      if (narrativeIndo && narrativeIndo !== "Gagal memproses narasi dari AI.") {
        const englishTranslationPrompt = `Translate the following Indonesian descriptive text for a video prompt to English. This text describes a scene including its subject, action, environment, style, etc. Be creative and evocative in your translation.
Indonesian Text:
"${narrativeIndo}"

English Translation:`;

        const engResponse: GenerateContentResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash-preview-04-17',
          contents: englishTranslationPrompt,
        });
        const narrativeEng = engResponse.text.trim();
        
        let fullEnglishPrompt = narrativeEng;
        if (spokenWords) {
           // Append original spoken words, not translated
          fullEnglishPrompt += `\n\nSpoken words: "${spokenWords}"`;
        }
        setGeneratedEnglishPrompt(fullEnglishPrompt);
      } else {
        setGeneratedEnglishPrompt("Could not generate English prompt due to issues with Indonesian narrative generation.");
      }

    } catch (e: any) {
      console.error("Error generating prompt:", e);
      setError(`Gagal menghasilkan prompt: ${e.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [promptData, ai]);

  const fieldConfig: Array<{ 
    key: PromptDataKey; 
    label: string; 
    placeholder?: string; 
    type?: 'text' | 'textarea' | 'select'; 
    rows?: number;
    options?: SelectOption[];
  }> = [
    { key: 'subject', label: 'Subjek', placeholder: 'Mis: Seorang astronot, dua kucing lucu' },
    { key: 'action', label: 'Aksi', placeholder: 'Mis: menjelajahi planet Mars, bermain benang', type: 'textarea', rows: 2 },
    { key: 'expression', label: 'Ekspresi', placeholder: 'Mis: wajah gembira, mata penuh keajaiban' },
    { key: 'place', label: 'Tempat/Setting', placeholder: 'Mis: hutan ajaib, kafe di pinggir pantai' },
    { key: 'time', label: 'Waktu', type: 'select', options: timeOptions },
    { key: 'cameraMovement', label: 'Gerakan Kamera', type: 'select', options: cameraMovementOptions },
    { key: 'lighting', label: 'Pencahayaan', type: 'select', options: lightingOptions },
    { key: 'videoStyle', label: 'Gaya Video', type: 'select', options: videoStyleOptions },
    { key: 'videoMood', label: 'Suasana Video', type: 'select', options: videoMoodOptions },
    { key: 'soundMusic', label: 'Suara atau Musik', placeholder: 'Mis: musik lo-fi tenang, suara ombak dan angin' },
    { key: 'spokenWords', label: 'Kalimat yang Diucapkan (Bahasa Asli)', placeholder: 'Mis: "Ini luar biasa!", "Apa yang terjadi?"', type: 'textarea', rows: 2 },
    { key: 'additionalDetails', label: 'Detail Tambahan', placeholder: 'Mis: memakai syal merah, efek slow motion', type: 'textarea', rows: 3 },
  ];

  return (
    <div className="min-h-screen bg-black text-gray-200 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600 sm:text-5xl">
            Veo 3 Prompt Generator <span className="block text-2xl text-indigo-400 mt-1">by DamareYt</span>
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Buat prompt yang detail dan efektif untuk model video Veo 3 dengan mudah.
          </p>
        </header>

        <main className="bg-slate-900 shadow-2xl shadow-purple-500/20 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fieldConfig.map(({ key, label, placeholder, type, rows, options }) => {
              if (type === 'select') {
                return (
                  <SelectField
                    key={key}
                    id={key}
                    label={label}
                    value={promptData[key]}
                    onChange={(value) => handleInputChange(key, value)}
                    options={options || []}
                  />
                );
              }
              return (
                <FormField
                  key={key}
                  id={key}
                  label={label}
                  value={promptData[key]}
                  onChange={(value) => handleInputChange(key, value)}
                  placeholder={placeholder}
                  type={type}
                  rows={rows}
                />
              );
            })}
          </div>
          
          <div className="pt-4">
            <button
              onClick={generateVeoPrompt}
              disabled={isLoading}
              className="w-full flex justify-center items-center px-6 py-3.5 border border-transparent text-base font-semibold rounded-lg shadow-md text-white bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all duration-150 ease-in-out transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.624L16.5 21.75l-.398-1.126a3.375 3.375 0 00-2.455-2.456L12.75 18l1.126-.398a3.375 3.375 0 002.455-2.456L16.5 14.25l.398 1.126a3.375 3.375 0 002.456 2.456L20.25 18l-1.126.398a3.375 3.375 0 00-2.456 2.456z" />
                  </svg>
                  Buat Prompt Ajaib!
                </>
              )}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-700/30 border border-red-500 text-red-300 rounded-md">
              <p className="font-semibold">Oops! Terjadi kesalahan:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
        </main>

        {(generatedIndonesianPrompt || generatedEnglishPrompt) && (
          <div className="mt-10 space-y-8">
            {generatedIndonesianPrompt && (
              <div className="bg-slate-800 shadow-xl shadow-purple-500/10 rounded-lg p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-semibold text-purple-400">Prompt (Bahasa Indonesia - Bisa Diedit)</h3>
                  <button
                    onClick={() => handleCopy(generatedIndonesianPrompt, 'indo')}
                    disabled={!generatedIndonesianPrompt}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center transition-colors duration-150 ease-in-out
                      ${copiedId === 'indo' 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-purple-500'
                      }
                      disabled:bg-gray-600 disabled:cursor-not-allowed`}
                  >
                    {copiedId === 'indo' ? 'Tersalin!' : <CopyIcon className="w-4 h-4 mr-1.5" />}
                    Salin
                  </button>
                </div>
                <textarea
                  value={generatedIndonesianPrompt}
                  onChange={(e) => setGeneratedIndonesianPrompt(e.target.value)}
                  rows={8}
                  className="w-full bg-slate-700 border border-slate-600 rounded-md p-3 text-gray-200 text-sm leading-relaxed focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500"
                  placeholder="Prompt Bahasa Indonesia akan muncul di sini..."
                />
              </div>
            )}

            {generatedEnglishPrompt && (
              <div className="bg-slate-800 shadow-xl shadow-purple-500/10 rounded-lg p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-semibold text-indigo-400">Final Prompt (English - Veo 3 Ready)</h3>
                  <button
                     onClick={() => handleCopy(generatedEnglishPrompt, 'eng')}
                     disabled={!generatedEnglishPrompt}
                     className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center transition-colors duration-150 ease-in-out
                       ${copiedId === 'eng' 
                         ? 'bg-green-600 text-white hover:bg-green-700' 
                         : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500'
                       }
                       disabled:bg-gray-600 disabled:cursor-not-allowed`}
                  >
                    {copiedId === 'eng' ? 'Copied!' : <CopyIcon className="w-4 h-4 mr-1.5" />}
                    Copy
                  </button>
                </div>
                <pre className="whitespace-pre-wrap bg-slate-700 p-4 rounded-md text-gray-200 text-sm leading-relaxed overflow-x-auto min-h-[100px]">
                  {generatedEnglishPrompt || "English prompt will appear here..."}
                </pre>
              </div>
            )}
          </div>
        )}

        <footer className="mt-16 mb-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Veo 3 Prompt Generator by DamareYt. Tingkatkan kreasi videomu!</p>
          <p className="mt-1">Dibuat untuk digunakan dengan model Veo 3 dari Google.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;