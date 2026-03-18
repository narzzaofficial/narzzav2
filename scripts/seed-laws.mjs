import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

function loadLocalEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

function toTs(dateString) {
  return Date.parse(`${dateString}T00:00:00.000Z`);
}

function slugify(text, id) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 70) + `-${id}`
  );
}

const lawDocs = [
  {
    title: "Undang-Undang Perlindungan Konsumen",
    category: "Konsumen",
    summary:
      "Aturan dasar perlindungan hak konsumen dan kewajiban pelaku usaha.",
    originalText:
      "Pasal 1\nDalam undang-undang ini, konsumen adalah setiap orang pemakai barang dan/atau jasa.\nPasal 2\nPerlindungan konsumen berasaskan manfaat, keadilan, keseimbangan, keamanan, dan keselamatan.",
    explanationLines: [
      { role: "q", text: "Apa inti utama UU ini?" },
      {
        role: "a",
        text: "Intinya melindungi konsumen dari praktik usaha yang merugikan.",
      },
      { role: "q", text: "Apa dampaknya ke pelaku usaha?" },
      {
        role: "a",
        text: "Pelaku usaha wajib memberi informasi yang benar, jelas, dan jujur.",
      },
    ],
    number: "UU 8",
    year: 1999,
    enactedAt: toTs("1999-04-20"),
    promulgatedAt: toTs("1999-04-20"),
    effectiveAt: toTs("1999-04-20"),
    status: "Berlaku",
    source: {
      institution: "JDIH BPK RI",
      originalUrl: "https://peraturan.bpk.go.id/Details/45288/uu-no-8-tahun-1999",
      pdfUrl: "",
    },
  },
  {
    title: "Undang-Undang Informasi dan Transaksi Elektronik",
    category: "Siber",
    summary:
      "Payung hukum aktivitas elektronik, dokumen digital, dan transaksi online.",
    originalText:
      "Pasal 1\nInformasi Elektronik adalah satu atau sekumpulan data elektronik.\nPasal 5\nInformasi Elektronik dan/atau Dokumen Elektronik serta hasil cetaknya merupakan alat bukti hukum yang sah.",
    explanationLines: [
      { role: "q", text: "Kenapa UU ITE penting?" },
      {
        role: "a",
        text: "Karena mengakui bukti elektronik dan mengatur aktivitas digital.",
      },
    ],
    number: "UU 11",
    year: 2008,
    enactedAt: toTs("2008-04-21"),
    promulgatedAt: toTs("2008-04-21"),
    effectiveAt: toTs("2008-04-21"),
    status: "Berlaku",
    source: {
      institution: "JDIH BPK RI",
      originalUrl:
        "https://peraturan.bpk.go.id/Details/37589/uu-no-11-tahun-2008",
      pdfUrl: "",
    },
  },
  {
    title: "Undang-Undang Ketenagakerjaan",
    category: "Ketenagakerjaan",
    summary:
      "Aturan hubungan kerja, hak pekerja, dan kewajiban pengusaha.",
    originalText:
      "Pasal 1\nTenaga kerja adalah setiap orang yang mampu melakukan pekerjaan.\nPasal 88\nSetiap pekerja berhak memperoleh penghasilan yang memenuhi penghidupan yang layak bagi kemanusiaan.",
    explanationLines: [
      { role: "q", text: "Apa fokus utama aturan ini?" },
      {
        role: "a",
        text: "Fokusnya pada perlindungan pekerja dan kepastian hubungan kerja.",
      },
    ],
    number: "UU 13",
    year: 2003,
    enactedAt: toTs("2003-03-25"),
    promulgatedAt: toTs("2003-03-25"),
    effectiveAt: toTs("2003-03-25"),
    status: "Diubah",
    source: {
      institution: "JDIH BPK RI",
      originalUrl:
        "https://peraturan.bpk.go.id/Details/43013/uu-no-13-tahun-2003",
      pdfUrl: "",
    },
  },
  {
    title: "Undang-Undang Lalu Lintas dan Angkutan Jalan",
    category: "LaluLintas",
    summary: "Kerangka hukum tertib berlalu lintas dan keselamatan jalan.",
    originalText:
      "Pasal 1\nLalu Lintas dan Angkutan Jalan adalah satu kesatuan sistem.\nPasal 106\nSetiap orang yang mengemudikan kendaraan wajib mengemudikan kendaraannya dengan wajar dan penuh konsentrasi.",
    explanationLines: [
      { role: "q", text: "Kenapa aturan ini sering dipakai di lapangan?" },
      {
        role: "a",
        text: "Karena menjadi dasar penegakan tertib lalu lintas sehari-hari.",
      },
    ],
    number: "UU 22",
    year: 2009,
    enactedAt: toTs("2009-06-22"),
    promulgatedAt: toTs("2009-06-22"),
    effectiveAt: toTs("2009-06-22"),
    status: "Berlaku",
    source: {
      institution: "JDIH BPK RI",
      originalUrl:
        "https://peraturan.bpk.go.id/Details/38776/uu-no-22-tahun-2009",
      pdfUrl: "",
    },
  },
  {
    title: "Kitab Undang-Undang Hukum Pidana",
    category: "Pidana",
    summary: "Aturan tindak pidana dan ancaman pidana.",
    originalText:
      "Pasal 1\nTiada suatu perbuatan dapat dipidana kecuali atas kekuatan ketentuan pidana.\nPasal 55\nDipidana sebagai pelaku tindak pidana mereka yang melakukan, menyuruh melakukan, dan turut serta melakukan perbuatan.",
    explanationLines: [
      { role: "q", text: "Apa prinsip paling mendasar?" },
      {
        role: "a",
        text: "Asas legalitas: tidak ada pidana tanpa aturan pidana terlebih dahulu.",
      },
    ],
    number: "KUHP 1",
    year: 2023,
    enactedAt: toTs("2023-01-02"),
    promulgatedAt: toTs("2023-01-02"),
    effectiveAt: toTs("2026-01-02"),
    status: "Berlaku",
    source: {
      institution: "JDIH Setneg",
      originalUrl: "https://jdih.setneg.go.id",
      pdfUrl: "",
    },
  },
  {
    title: "Undang-Undang Perkawinan",
    category: "Keluarga",
    summary:
      "Dasar hukum perkawinan, syarat sah, serta hak dan kewajiban suami istri.",
    originalText:
      "Pasal 1\nPerkawinan adalah ikatan lahir batin antara seorang pria dengan seorang wanita.\nPasal 2\nPerkawinan adalah sah apabila dilakukan menurut hukum masing-masing agama.",
    explanationLines: [
      { role: "q", text: "Apa poin krusial yang sering ditanya?" },
      {
        role: "a",
        text: "Syarat sah perkawinan menurut agama dan pencatatan negara.",
      },
    ],
    number: "UU 1",
    year: 1974,
    enactedAt: toTs("1974-01-02"),
    promulgatedAt: toTs("1974-01-02"),
    effectiveAt: toTs("1974-01-02"),
    status: "Diubah",
    source: {
      institution: "JDIH BPK RI",
      originalUrl: "https://peraturan.bpk.go.id",
      pdfUrl: "",
    },
  },
  {
    title: "Undang-Undang Pokok Agraria",
    category: "Pertanahan",
    summary: "Landasan hukum hak atas tanah dan pengelolaan agraria nasional.",
    originalText:
      "Pasal 2\nBumi, air dan ruang angkasa termasuk kekayaan alam dikuasai oleh negara.\nPasal 16\nHak-hak atas tanah meliputi hak milik, hak guna usaha, hak guna bangunan, dan hak pakai.",
    explanationLines: [
      { role: "q", text: "Kenapa UUPA masih sentral?" },
      {
        role: "a",
        text: "Karena menjadi dasar rezim hak atas tanah sampai sekarang.",
      },
    ],
    number: "UU 5",
    year: 1960,
    enactedAt: toTs("1960-09-24"),
    promulgatedAt: toTs("1960-09-24"),
    effectiveAt: toTs("1960-09-24"),
    status: "Berlaku",
    source: {
      institution: "JDIH BPK RI",
      originalUrl: "https://peraturan.bpk.go.id",
      pdfUrl: "",
    },
  },
  {
    title: "Undang-Undang Pajak Penghasilan",
    category: "Pajak",
    summary: "Aturan pengenaan pajak atas penghasilan subjek pajak.",
    originalText:
      "Pasal 4\nYang menjadi objek pajak adalah penghasilan.\nPasal 17\nTarif pajak yang diterapkan atas penghasilan kena pajak.",
    explanationLines: [
      { role: "q", text: "Apa simpelnya objek pajak?" },
      {
        role: "a",
        text: "Secara umum, setiap tambahan kemampuan ekonomis adalah objek pajak.",
      },
    ],
    number: "UU 7",
    year: 1983,
    enactedAt: toTs("1983-12-31"),
    promulgatedAt: toTs("1983-12-31"),
    effectiveAt: toTs("1984-01-01"),
    status: "Diubah",
    source: {
      institution: "JDIH BPK RI",
      originalUrl: "https://peraturan.bpk.go.id",
      pdfUrl: "",
    },
  },
  {
    title: "Kitab Undang-Undang Hukum Perdata",
    category: "Perdata",
    summary: "Ketentuan umum perikatan, benda, dan hukum keluarga perdata.",
    originalText:
      "Pasal 1313\nSuatu perjanjian adalah suatu perbuatan dengan mana satu orang atau lebih mengikatkan dirinya.\nPasal 1320\nSyarat sah perjanjian adalah sepakat, cakap, objek tertentu, dan sebab yang halal.",
    explanationLines: [
      { role: "q", text: "Apa pasal paling populer di praktik?" },
      {
        role: "a",
        text: "Pasal 1320 tentang syarat sah perjanjian hampir selalu dipakai.",
      },
    ],
    number: "KUHPer 1",
    year: 1847,
    enactedAt: toTs("1847-04-30"),
    promulgatedAt: toTs("1847-04-30"),
    effectiveAt: toTs("1848-05-01"),
    status: "Berlaku",
    source: {
      institution: "JDIH MA",
      originalUrl: "https://jdih.mahkamahagung.go.id",
      pdfUrl: "",
    },
  },
  {
    title: "Undang-Undang Perseroan Terbatas",
    category: "Bisnis",
    summary:
      "Aturan pendirian, organ perseroan, dan tanggung jawab dalam PT.",
    originalText:
      "Pasal 1\nPerseroan Terbatas adalah badan hukum.\nPasal 3\nPemegang saham perseroan tidak bertanggung jawab secara pribadi atas perikatan perseroan.",
    explanationLines: [
      { role: "q", text: "Kenapa UU PT penting untuk startup?" },
      {
        role: "a",
        text: "Karena mengatur bentuk badan hukum dan batas tanggung jawab pemegang saham.",
      },
    ],
    number: "UU 40",
    year: 2007,
    enactedAt: toTs("2007-08-16"),
    promulgatedAt: toTs("2007-08-16"),
    effectiveAt: toTs("2007-08-16"),
    status: "Berlaku",
    source: {
      institution: "JDIH BPK RI",
      originalUrl:
        "https://peraturan.bpk.go.id/Details/39965/uu-no-40-tahun-2007",
      pdfUrl: "",
    },
  },
];

const LawDocSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    summary: { type: String, default: "" },
    originalText: { type: String, required: true },
    explanationLines: { type: Array, default: [] },
    number: { type: String, required: true },
    year: { type: Number, required: true },
    enactedAt: { type: Number, required: true },
    promulgatedAt: { type: Number, required: true },
    effectiveAt: { type: Number },
    status: { type: String, default: "Berlaku" },
    source: {
      institution: { type: String, required: true },
      originalUrl: { type: String, required: true },
      pdfUrl: { type: String },
    },
    createdAt: { type: Number, default: Date.now },
  },
  { versionKey: false }
);

const LawDocModel =
  mongoose.models.LawDoc || mongoose.model("LawDoc", LawDocSchema);

async function run() {
  loadLocalEnv();
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI not found in environment");
  }

  await mongoose.connect(uri, {
    bufferCommands: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });

  let nextId = (await LawDocModel.findOne().sort({ id: -1 }).lean())?.id || 0;
  let inserted = 0;
  let skipped = 0;

  for (const item of lawDocs) {
    const existing = await LawDocModel.findOne({
      number: item.number,
      year: item.year,
    }).lean();

    if (existing) {
      skipped += 1;
      continue;
    }

    nextId += 1;
    await LawDocModel.create({
      ...item,
      id: nextId,
      slug: slugify(item.title, nextId),
      createdAt: Date.now(),
    });
    inserted += 1;
  }

  console.log(
    `Seed laws finished. inserted=${inserted}, skipped=${skipped}, total_input=${lawDocs.length}`
  );
  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error("Seed laws failed:", error);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});

