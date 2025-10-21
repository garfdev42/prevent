import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utilidad para combinar clases de Tailwind CSS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatear números como moneda colombiana
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Formatear fechas en formato local colombiano
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

// Generar contenido CSV a partir de datos y encabezados
export function generateCSV(data: any[], headers: string[]): string {
  const headerRow = headers.join(",");
  const rows = data.map((row) =>
    headers
      .map((header) => {
        const value = row[header];
        return typeof value === "string" && value.includes(",")
          ? `"${value}"`
          : value;
      })
      .join(",")
  );
  return [headerRow, ...rows].join("\n");
}

// Descargar archivo CSV en el navegador
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
