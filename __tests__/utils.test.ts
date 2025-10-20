import { formatCurrency, formatDate, generateCSV } from "@/lib/utils";

describe("Utility Functions", () => {
  describe("formatCurrency", () => {
    it("debe formatear números a formato de moneda colombiana", () => {
      expect(formatCurrency(1000)).toBe("$1.000");
      expect(formatCurrency(1500.5)).toBe("$1.501");
      expect(formatCurrency(0)).toBe("$0");
    });

    it("debe manejar números negativos correctamente", () => {
      expect(formatCurrency(-500)).toBe("-$500");
    });

    it("debe formatear números grandes correctamente", () => {
      expect(formatCurrency(1000000)).toBe("$1.000.000");
    });
  });

  describe("formatDate", () => {
    it("debe formatear fechas correctamente", () => {
      const date = new Date("2024-01-15");
      const formatted = formatDate(date);
      expect(formatted).toMatch(/15\/01\/2024/);
    });

    it("debe formatear strings de fecha correctamente", () => {
      const dateString = "2024-12-25";
      const formatted = formatDate(dateString);
      expect(formatted).toMatch(/25\/12\/2024/);
    });

    it("debe manejar diferentes formatos de fecha", () => {
      const date = new Date(2024, 5, 10);
      const formatted = formatDate(date);
      expect(formatted).toMatch(/10\/06\/2024/);
    });
  });

  describe("generateCSV", () => {
    it("debe generar CSV correctamente con datos simples", () => {
      const data = [
        { nombre: "Juan", edad: 30 },
        { nombre: "María", edad: 25 },
      ];
      const headers = ["nombre", "edad"];
      const csv = generateCSV(data, headers);

      expect(csv).toContain("nombre,edad");
      expect(csv).toContain("Juan,30");
      expect(csv).toContain("María,25");
    });

    it("debe manejar valores con comas correctamente", () => {
      const data = [{ nombre: "Juan Pérez", ciudad: "Bogotá, Colombia" }];
      const headers = ["nombre", "ciudad"];
      const csv = generateCSV(data, headers);

      expect(csv).toContain('"Bogotá, Colombia"');
    });

    it("debe generar CSV vacío con solo headers", () => {
      const data: any[] = [];
      const headers = ["nombre", "edad"];
      const csv = generateCSV(data, headers);

      expect(csv).toBe("nombre,edad");
    });
  });
});
