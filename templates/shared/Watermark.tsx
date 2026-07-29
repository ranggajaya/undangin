// Sengaja pakai warna brand Undangin langsung (bukan `theme` milik template),
// karena ini identitas produk, bukan bagian dari desain undangan itu sendiri.
export function Watermark() {
  return (
    <a
      href="/"
      target="_blank"
      className="mt-6 flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs"
      style={{ backgroundColor: "#FDF8F420", color: "#FDF8F4" }}
    >
      Dibuat dengan{" "}
      <span className="font-heading" style={{ color: "#C17767" }}>
        undangin
      </span>
    </a>
  );
}
