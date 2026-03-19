import mongoose from "mongoose";

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI belum tersedia. Jalankan dengan env yang benar.");
}

const topicSchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    description: String,
    eyebrow: String,
    icon: String,
    isActive: Boolean,
    createdAt: Number,
    updatedAt: Number,
  },
  { versionKey: false, strict: false }
);

const companySchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    topicId: mongoose.Schema.Types.ObjectId,
    logo: String,
    description: String,
    isActive: Boolean,
    createdAt: Number,
    updatedAt: Number,
  },
  { versionKey: false, strict: false }
);

const appSchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    companyId: mongoose.Schema.Types.ObjectId,
    description: String,
    icon: String,
    isPopular: Boolean,
    popularScore: Number,
    isActive: Boolean,
    createdAt: Number,
    updatedAt: Number,
  },
  { versionKey: false, strict: false }
);

const documentSchema = new mongoose.Schema(
  {
    title: String,
    slug: String,
    appId: mongoose.Schema.Types.ObjectId,
    type: String,
    dek: String,
    tosOriginal: String,
    tosTranslation: String,
    analysis: Object,
    content: Array,
    isActive: Boolean,
    createdAt: Number,
    updatedAt: Number,
  },
  { versionKey: false, strict: false }
);

const AgreeTopic = mongoose.models.AgreeTopic || mongoose.model("AgreeTopic", topicSchema);
const AgreeCompany = mongoose.models.AgreeCompany || mongoose.model("AgreeCompany", companySchema);
const AgreeApp = mongoose.models.AgreeApp || mongoose.model("AgreeApp", appSchema);
const AgreeDocument =
  mongoose.models.AgreeDocument || mongoose.model("AgreeDocument", documentSchema);

const now = Date.now();

const seed = [
  {
    topic: {
      name: "Technology",
      slug: "technology",
      description: "Bedah Terms of Service dan kebijakan digital dengan bahasa yang lebih manusiawi.",
      eyebrow: "Setelah Klik Agree",
      icon: "cpu",
    },
    companies: [
      {
        name: "Meta",
        slug: "meta",
        logo: "https://picsum.photos/seed/meta-logo/160/160",
        description: "Perusahaan di balik Instagram, WhatsApp, Facebook, dan Messenger.",
        apps: [
          {
            name: "Instagram",
            slug: "instagram",
            icon: "https://picsum.photos/seed/instagram-icon/160/160",
            description: "Platform sosial visual dengan aturan lisensi konten, moderasi, dan akun.",
            isPopular: true,
            popularScore: 100,
            documents: [
              {
                title: "Terms of Service",
                slug: "terms-of-service",
                type: "terms-of-service",
                dek: "Membedah apa yang sebenarnya kamu setujui saat memakai Instagram.",
                tosOriginal: "## Terms of Service\n\nBy using Instagram, you agree to follow our rules, community standards, and all applicable laws.\n\nYou are responsible for activity that occurs through your account. If you violate these terms, we may remove content, limit features, or disable your account.\n\nYou keep ownership of the content you create, but you grant us a broad license to host, use, distribute, modify, run, copy, publicly perform or display, translate, and create derivative works of your content.\n\nWe may use information about your activity, device, and interactions to personalize content, improve our services, and show relevant ads.\n\nWe can change, suspend, or discontinue parts of the service at any time. We may also update these terms, and your continued use means you accept the new version.",
                tosTranslation: "## Terjemahan Ringkas\n\nSaat memakai Instagram, kamu dianggap setuju mengikuti aturan platform, standar komunitas, dan hukum yang berlaku.\n\nKamu bertanggung jawab atas semua aktivitas yang terjadi lewat akunmu. Kalau melanggar aturan, Instagram bisa menghapus konten, membatasi fitur, atau menonaktifkan akunmu.\n\nKonten tetap milikmu, tetapi kamu memberi Instagram izin yang sangat luas untuk menyimpan, memakai, mendistribusikan, memodifikasi, menerjemahkan, dan menampilkan konten itu.\n\nInstagram juga bisa memakai data aktivitas, perangkat, dan interaksi kamu untuk personalisasi pengalaman dan iklan yang lebih relevan.\n\nMereka bisa mengubah layanan atau isi syarat kapan saja. Kalau kamu tetap memakai aplikasi setelah perubahan itu, kamu dianggap menyetujui versi baru.",
                analysis: {
                  summary: ["Instagram meminta izin luas atas distribusi kontenmu.", "Akun bisa dibatasi jika dianggap melanggar aturan.", "Data aktivitas dipakai untuk personalisasi dan iklan."],
                  agreedWithoutRealizing: ["Lisensi kontenmu sangat luas.", "Perubahan syarat bisa berlaku lewat continued use.", "Moderasi akun sepenuhnya ada di tangan platform."],
                  surprisingPoints: ["Hak platform atas derivative works sering luput dibaca.", "Tidak semua pembatasan akun harus menunggu putusan hukum."],
                  dataCollected: ["Aktivitas di aplikasi", "Informasi perangkat", "Interaksi dengan konten dan iklan"],
                  platformRights: ["Menghapus atau membatasi akun", "Menampilkan dan mendistribusikan ulang konten", "Memperbarui aturan sewaktu-waktu"],
                  risks: ["Konten bisa hilang atau dibatasi", "Jangkauan akun berubah karena moderasi", "Privasi perilaku digital dipakai untuk iklan"],
                  tips: ["Pisahkan arsip konten penting", "Review pengaturan privasi", "Jangan bergantung pada satu platform saja"],
                },
                content: [
                  { role: "q", text: "Apa inti Terms of Service Instagram?" },
                  { role: "a", text: "Intinya kamu boleh pakai platform, tapi harus tunduk ke aturan mereka dan memberi lisensi luas atas kontenmu." },
                  { role: "q", text: "Apakah fotoku tetap milikku?" },
                  { role: "a", text: "Secara formal iya, tapi Instagram dapat izin sangat luas untuk menyimpan, menampilkan, dan mendistribusikannya." },
                  { role: "q", text: "Kalau aku melanggar aturan apa yang bisa terjadi?" },
                  { role: "a", text: "Konten bisa dihapus, fitur dibatasi, sampai akun dinonaktifkan." },
                  { role: "q", text: "Kenapa data aktivitasku penting?" },
                  { role: "a", text: "Karena data itu dipakai buat personalisasi feed, rekomendasi, dan iklan." },
                  { role: "q", text: "Apakah syarat bisa berubah?" },
                  { role: "a", text: "Bisa, dan continued use biasanya dianggap sebagai persetujuan versi baru." },
                ],
              },
            ],
          },
          {
            name: "WhatsApp",
            slug: "whatsapp",
            icon: "https://picsum.photos/seed/whatsapp-icon/160/160",
            description: "Aplikasi pesan instan dengan fokus metadata dan integrasi akun.",
            isPopular: true,
            popularScore: 97,
          },
          {
            name: "Facebook",
            slug: "facebook",
            icon: "https://picsum.photos/seed/facebook-icon/160/160",
            description: "Platform sosial dengan distribusi konten dan personalisasi iklan.",
            isPopular: true,
            popularScore: 94,
          },
          {
            name: "Messenger",
            slug: "messenger",
            icon: "https://picsum.photos/seed/messenger-icon/160/160",
            description: "Aplikasi percakapan yang terhubung ke identitas dan jaringan sosial.",
            isPopular: true,
            popularScore: 91,
          },
        ],
      },
      {
        name: "Google",
        slug: "google",
        logo: "https://picsum.photos/seed/google-logo/160/160",
        description: "Ekosistem produk digital besar dengan dokumen kebijakan berlapis.",
        apps: [
          {
            name: "YouTube",
            slug: "youtube",
            icon: "https://picsum.photos/seed/youtube-icon/160/160",
            description: "Platform video dengan monetisasi, hak cipta, dan moderasi komunitas.",
            isPopular: true,
            popularScore: 88,
          },
          {
            name: "Zoom",
            slug: "zoom",
            icon: "https://picsum.photos/seed/zoom-icon/160/160",
            description: "Layanan meeting yang memproses audio, video, dan metadata partisipasi.",
            isPopular: true,
            popularScore: 70,
          },
        ],
      },
      {
        name: "GitHub",
        slug: "github",
        logo: "https://picsum.photos/seed/github-logo/160/160",
        description: "Platform kolaborasi code dengan ketentuan seputar repository dan lisensi.",
        apps: [
          {
            name: "GitHub",
            slug: "github-app",
            icon: "https://picsum.photos/seed/github-icon/160/160",
            description: "Layanan repository dan automation untuk developer.",
            isPopular: true,
            popularScore: 68,
          },
        ],
      },
    ],
  },
  {
    topic: {
      name: "Social Media",
      slug: "social-media",
      description: "Platform sosial, distribusi konten, dan bagaimana kebijakannya mempengaruhi user.",
      eyebrow: "Setelah Klik Agree",
      icon: "message-square",
    },
    companies: [
      {
        name: "ByteDance",
        slug: "bytedance",
        logo: "https://picsum.photos/seed/bytedance-logo/160/160",
        description: "Perusahaan di balik TikTok dengan fokus distribusi konten berbasis rekomendasi.",
        apps: [
          {
            name: "TikTok",
            slug: "tiktok",
            icon: "https://picsum.photos/seed/tiktok-icon/160/160",
            description: "Platform video pendek berbasis model rekomendasi perilaku.",
            isPopular: true,
            popularScore: 86,
          },
        ],
      },
      {
        name: "Telegram",
        slug: "telegram",
        logo: "https://picsum.photos/seed/telegram-logo/160/160",
        description: "Platform messaging dengan channel, bot, dan grup publik.",
        apps: [
          {
            name: "Telegram",
            slug: "telegram",
            icon: "https://picsum.photos/seed/telegram-icon/160/160",
            description: "Layanan perpesanan dengan kombinasi kanal publik dan percakapan privat.",
            isPopular: true,
            popularScore: 82,
          },
        ],
      },
      {
        name: "Snap",
        slug: "snap",
        logo: "https://picsum.photos/seed/snap-logo/160/160",
        description: "Perusahaan media sosial berbasis komunikasi visual cepat.",
        apps: [
          {
            name: "Snapchat",
            slug: "snapchat",
            icon: "https://picsum.photos/seed/snapchat-icon/160/160",
            description: "Aplikasi pesan visual dengan fitur arsip, discover, dan ads.",
            isPopular: true,
            popularScore: 64,
          },
        ],
      },
    ],
  },
  {
    topic: {
      name: "Productivity",
      slug: "productivity",
      description: "Tool kerja dan kolaborasi yang sering meminta izin akses data organisasi dan file.",
      eyebrow: "Setelah Klik Agree",
      icon: "briefcase",
    },
    companies: [
      {
        name: "Discord",
        slug: "discord",
        logo: "https://picsum.photos/seed/discord-logo/160/160",
        description: "Komunitas berbasis server dengan aturan konten dan moderasi ruang.",
        apps: [
          {
            name: "Discord",
            slug: "discord",
            icon: "https://picsum.photos/seed/discord-icon/160/160",
            description: "Layanan komunitas, voice, dan chat berbasis server.",
            isPopular: true,
            popularScore: 80,
            documents: [
              {
                title: "Community Guidelines",
                slug: "community-guidelines",
                type: "community-guidelines",
                dek: "Panduan yang menjelaskan perilaku apa saja yang bisa membuat konten atau akun dibatasi.",
                tosOriginal: "## Community Guidelines\n\nYou may not engage in harassment, threats, hateful conduct, or illegal activity. We may remove content, restrict access, or disable accounts that violate these rules.",
                tosTranslation: "## Pedoman Komunitas\n\nKamu tidak boleh melakukan pelecehan, ancaman, ujaran kebencian, atau aktivitas ilegal. Discord dapat menghapus konten, membatasi akses, atau menonaktifkan akun yang melanggar aturan ini.",
                analysis: {
                  summary: ["Moderasi Discord fokus pada perilaku komunitas.", "Penegakan bisa berupa hapus konten atau suspend akun.", "Server bukan ruang yang sepenuhnya bebas aturan."],
                  agreedWithoutRealizing: ["Semua interaksi komunitas tetap tunduk pada policy pusat.", "Admin server bukan otoritas tunggal.", "Penegakan bisa terjadi lintas server."],
                  surprisingPoints: ["Aturan pusat bisa mengalahkan aturan komunitas lokal."],
                  dataCollected: ["Laporan user", "Metadata aktivitas", "Konten yang di-review saat enforcement"],
                  platformRights: ["Menghapus konten", "Membatasi akses fitur", "Menonaktifkan akun"],
                  risks: ["Server bisa hilang akses", "Riwayat komunitas terganggu", "Akun utama terkena enforcement"],
                  tips: ["Baca guideline sebelum bangun komunitas", "Pisahkan akun personal dan komunitas", "Arsipkan aturan server sendiri"],
                },
                content: [
                  { role: "q", text: "Apa fokus utama guideline Discord?" },
                  { role: "a", text: "Mereka fokus ke keamanan komunitas, pelecehan, ancaman, dan konten yang dilarang." },
                  { role: "q", text: "Kalau server punya aturan sendiri, apakah itu cukup?" },
                  { role: "a", text: "Belum tentu. Aturan server tetap berada di bawah policy pusat Discord." },
                ],
              },
            ],
          },
          {
            name: "LinkedIn",
            slug: "linkedin",
            icon: "https://picsum.photos/seed/linkedin-icon/160/160",
            description: "Platform profesional dengan data profil, jejaring, dan iklan rekrutmen.",
            isPopular: true,
            popularScore: 62,
          },
        ],
      },
    ],
  },
  {
    topic: {
      name: "Entertainment",
      slug: "entertainment",
      description: "Layanan hiburan digital dengan lisensi, rekomendasi, dan perilaku konsumsi user.",
      eyebrow: "Setelah Klik Agree",
      icon: "play-circle",
    },
    companies: [
      {
        name: "Spotify",
        slug: "spotify",
        logo: "https://picsum.photos/seed/spotify-logo/160/160",
        description: "Layanan streaming audio dengan tracking kebiasaan mendengar.",
        apps: [
          {
            name: "Spotify",
            slug: "spotify",
            icon: "https://picsum.photos/seed/spotify-icon/160/160",
            description: "Platform streaming musik dan podcast.",
            isPopular: true,
            popularScore: 60,
          },
        ],
      },
      {
        name: "Twitch",
        slug: "twitch",
        logo: "https://picsum.photos/seed/twitch-logo/160/160",
        description: "Platform live streaming dengan interaksi komunitas real-time.",
        apps: [
          {
            name: "Twitch",
            slug: "twitch",
            icon: "https://picsum.photos/seed/twitch-icon/160/160",
            description: "Live streaming berbasis komunitas dan monetisasi creator.",
            isPopular: true,
            popularScore: 58,
          },
        ],
      },
    ],
  },
];

async function upsertTopic(topic) {
  const existing = await AgreeTopic.findOne({ slug: topic.slug });
  const nowValue = Date.now();

  if (existing) {
    existing.set({ ...topic, isActive: true, updatedAt: nowValue });
    await existing.save();
    return existing;
  }

  return AgreeTopic.create({
    ...topic,
    isActive: true,
    createdAt: nowValue,
    updatedAt: nowValue,
  });
}

async function upsertCompany(topicDoc, company) {
  const { apps, ...companyPayload } = company;
  const existing = await AgreeCompany.findOne({ topicId: topicDoc._id, slug: company.slug });
  const nowValue = Date.now();

  if (existing) {
    existing.set({
      ...companyPayload,
      topicId: topicDoc._id,
      isActive: true,
      updatedAt: nowValue,
    });
    await existing.save();
    return existing;
  }

  return AgreeCompany.create({
    ...companyPayload,
    topicId: topicDoc._id,
    isActive: true,
    createdAt: nowValue,
    updatedAt: nowValue,
  });
}

async function upsertApp(companyDoc, app, rank) {
  const { documents, ...appPayload } = app;
  const existing = await AgreeApp.findOne({ companyId: companyDoc._id, slug: app.slug });
  const nowValue = Date.now() + rank;

  if (existing) {
    existing.set({
      ...appPayload,
      companyId: companyDoc._id,
      isActive: true,
      updatedAt: nowValue,
      createdAt: existing.createdAt ?? nowValue,
    });
    await existing.save();
    return existing;
  }

  return AgreeApp.create({
    ...appPayload,
    companyId: companyDoc._id,
    isActive: true,
    createdAt: nowValue,
    updatedAt: nowValue,
  });
}

async function upsertDocument(appDoc, document, rank) {
  const existing = await AgreeDocument.findOne({ appId: appDoc._id, slug: document.slug });
  const nowValue = Date.now() + rank;

  if (existing) {
    existing.set({
      ...document,
      appId: appDoc._id,
      isActive: true,
      updatedAt: nowValue,
      createdAt: existing.createdAt ?? nowValue,
    });
    await existing.save();
    return existing;
  }

  return AgreeDocument.create({
    ...document,
    appId: appDoc._id,
    isActive: true,
    createdAt: nowValue,
    updatedAt: nowValue,
  });
}

async function main() {
  await mongoose.connect(MONGODB_URI);

  let topicCount = 0;
  let companyCount = 0;
  let appCount = 0;
  let documentCount = 0;
  let rank = 0;

  for (const topicGroup of seed) {
    const topicDoc = await upsertTopic(topicGroup.topic);
    topicCount += 1;

    for (const company of topicGroup.companies) {
      const companyDoc = await upsertCompany(topicDoc, company);
      companyCount += 1;

      for (const app of company.apps) {
        rank += 1;
        const appDoc = await upsertApp(companyDoc, app, rank);
        appCount += 1;

        for (const document of app.documents ?? []) {
          rank += 1;
          await upsertDocument(appDoc, document, rank);
          documentCount += 1;
        }
      }
    }
  }

  console.log("Seed agree selesai", {
    topics: topicCount,
    companies: companyCount,
    apps: appCount,
    documents: documentCount,
    finishedAt: new Date(now).toISOString(),
  });

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("Seed agree gagal", error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
