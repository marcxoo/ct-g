import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite que el server de desarrollo cargue sus recursos desde la IP de la
  // red local (iPhone, otros dispositivos) sin bloquear el JS de React.
  allowedDevOrigins: ["192.168.1.9"],
  // pdfkit carga sus fuentes .afm por fs desde node_modules; mantenerlo como
  // paquete externo evita que el bundler rompa esas rutas (export-pdf).
  serverExternalPackages: ["pdfkit"],
};

export default nextConfig;
