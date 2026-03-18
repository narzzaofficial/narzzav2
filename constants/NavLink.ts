type NavLink = {
  title: string;
  note: string;
  href:
    | "/"
    | "/berita"
    | "/tutorial"
    | "/riset"
    | "/hukum-indonesia"
    | "/pusat-hadist"
    | "/tentang";
};

export const navLink: NavLink[] = [
  { title: "Home Feed", note: "Semua update terbaru", href: "/" },
  { title: "Berita", note: "Tren dan breaking tech", href: "/berita" },
  { title: "Tutorial", note: "Step-by-step praktis", href: "/tutorial" },
  { title: "Riset", note: "Hasil eksperimen tim", href: "/riset" },
  {
    title: "Hukum Indonesia",
    note: "UU, peraturan, putusan",
    href: "/hukum-indonesia",
  },
  { title: "Pusat Hadist", note: "Kumpulan hadist", href: "/pusat-hadist" },
  { title: "Tentang", note: "Misi, tim, kontak", href: "/tentang" },
];
