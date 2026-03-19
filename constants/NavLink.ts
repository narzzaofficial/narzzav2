type NavLink = {
  title: string;
  note: string;
  href:
    | "/"
    | "/berita"
    | "/tutorial"
    | "/riset"
    | "/hukum-indonesia"
    | "/setelah-klik-agree"
    | "/tentang";
};

export const navLink: NavLink[] = [
  { title: "Home Feed", note: "Semua update terbaru", href: "/" },
  { title: "Berita", note: "Tren dan breaking news", href: "/berita" },
  { title: "Tutorial", note: "Step-by-step praktis", href: "/tutorial" },
  { title: "Riset", note: "Hasil eksperimen tim", href: "/riset" },
  {
    title: "Hukum Indonesia",
    note: "UU, peraturan, putusan",
    href: "/hukum-indonesia",
  },
  {
    title: "Setelah Klik Agree",
    note: "Bedah TOS, privacy policy",
    href: "/setelah-klik-agree",
  },
  { title: "Tentang", note: "Misi, tim, kontak", href: "/tentang" },
];
