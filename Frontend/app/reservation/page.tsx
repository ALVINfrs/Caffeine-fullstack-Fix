"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Coffee,
  Monitor,
  Volume2,
  Globe,
  ArrowLeft,
  Info,
  CheckCircle,
  AlertCircle,
  Star,
  Wifi,
  Car,
  CreditCard,
  Phone,
  Mail,
  FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Types
interface Room {
  type: string;
  name: string;
  description: string;
  tables: Table[];
  features?: string[];
  pricePerHour: number;
}

interface Table {
  room_type: string;
  table_number: string;
  capacity: number;
  description: string;
  is_available: boolean;
  features?: string[];
  price_per_hour: number;
  formatted_price: string;
}

interface ReservationForm {
  customerName: string;
  email: string;
  phone: string;
  reservationDate: string;
  reservationTime: string;
  durationHours: number;
  roomType: string;
  tableNumber: string;
  guestCount: number;
  specialRequest: string;
}

export default function ReservationPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [availability, setAvailability] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<ReservationForm>({
    customerName: "",
    email: "",
    phone: "",
    reservationDate: "",
    reservationTime: "",
    durationHours: 2,
    roomType: "",
    tableNumber: "",
    guestCount: 1,
    specialRequest: "",
  });

  useEffect(() => {
    setIsLoaded(true);
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/reservations/rooms",
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        setRooms(data.data);
      } else {
        throw new Error(data.error || "Gagal mengambil data ruangan");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengambil data ruangan",
        variant: "destructive",
      });
    }
  };

  const checkAvailability = async () => {
    if (
      !formData.roomType ||
      !formData.tableNumber ||
      !formData.reservationDate ||
      !formData.reservationTime
    ) {
      return;
    }

    setCheckingAvailability(true);
    try {
      const params = new URLSearchParams({
        roomType: formData.roomType,
        tableNumber: formData.tableNumber,
        date: formData.reservationDate,
        time: formData.reservationTime,
        duration: formData.durationHours.toString(),
      });

      const response = await fetch(
        `http://localhost:3000/api/reservations/check-availability?${params}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();

      if (data.success) {
        setAvailability(data.available);
        if (!data.available) {
          toast({
            title: "Tidak Tersedia",
            description: "Meja sudah dipesan untuk waktu tersebut",
            variant: "destructive",
          });
        }
      } else {
        throw new Error(data.error || "Gagal memeriksa ketersediaan");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memeriksa ketersediaan",
        variant: "destructive",
      });
    } finally {
      setCheckingAvailability(false);
    }
  };

  useEffect(() => {
    if (
      formData.roomType &&
      formData.tableNumber &&
      formData.reservationDate &&
      formData.reservationTime
    ) {
      checkAvailability();
    }
  }, [
    formData.roomType,
    formData.tableNumber,
    formData.reservationDate,
    formData.reservationTime,
    formData.durationHours,
  ]);

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
    setSelectedTable(null);
    setFormData((prev) => ({
      ...prev,
      roomType: room.type,
      tableNumber: "",
    }));
  };

  const handleTableSelect = (table: Table) => {
    setSelectedTable(table);
    setFormData((prev) => ({
      ...prev,
      tableNumber: table.table_number,
      guestCount: Math.min(prev.guestCount, table.capacity),
    }));
    setSelectedRoom((prev) =>
      prev
        ? {
            ...prev,
            pricePerHour: table.price_per_hour,
          }
        : null
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (availability === false) {
      toast({
        title: "Error",
        description: "Meja tidak tersedia untuk waktu yang dipilih",
        variant: "destructive",
      });
      return;
    }

    if (!selectedRoom?.pricePerHour) {
      toast({
        title: "Error",
        description: "Harga ruangan tidak tersedia",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/reservations/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Reservasi Berhasil!",
          description: `Nomor reservasi: ${data.data.reservationNumber}`,
          variant: "default",
        });

        setFormData({
          customerName: "",
          email: "",
          phone: "",
          reservationDate: "",
          reservationTime: "",
          durationHours: 2,
          roomType: "",
          tableNumber: "",
          guestCount: 1,
          specialRequest: "",
        });
        setSelectedRoom(null);
        setSelectedTable(null);
        setAvailability(null);
      } else {
        toast({
          title: "Error",
          description: data.error || "Gagal membuat reservasi",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat membuat reservasi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoomIcon = (roomType: string) => {
    switch (roomType) {
      case "coding-zone":
        return <Monitor className="w-6 h-6" />;
      case "meeting-room":
        return <Users className="w-6 h-6" />;
      case "quiet-corner":
        return <Volume2 className="w-6 h-6" />;
      case "open-space":
        return <Globe className="w-6 h-6" />;
      default:
        return <Coffee className="w-6 h-6" />;
    }
  };

  const calculateTotalPrice = () => {
    if (!selectedRoom || !selectedRoom.pricePerHour) {
      return 0;
    }
    return selectedRoom.pricePerHour * formData.durationHours;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-neutral-900 dark:to-neutral-800">
      {/* Back to Home Button */}
      <div className="fixed top-4 left-4 z-40">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Kembali ke Beranda</span>
        </button>
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 dark:from-black/70 dark:to-black/30 z-0"></div>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50 dark:opacity-50 z-[-1]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
          }}
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-700 dark:text-white text-white ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              Reservasi{" "}
              <span className="caffeine-blink text-amber-400">Workspace</span>
            </h1>
            <p
              className={`text-lg md:text-xl mb-8 transition-all duration-700 delay-300 text-gray-200 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              Pesan ruang kerja ideal untuk coding session, meeting, atau focus
              time Anda
            </p>
            <div
              className={`flex flex-wrap justify-center gap-4 text-sm text-gray-300 transition-all duration-700 delay-500 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4" />
                High-Speed WiFi
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4" />
                Free Parking
              </div>
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4" />
                Complimentary Coffee
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="py-8 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Informasi Penting
                  </h3>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Reservasi dapat dibuat maksimal 30 hari ke depan</li>
                    <li>
                      • Pembatalan gratis hingga 24 jam sebelum waktu reservasi
                    </li>
                    <li>
                      • Konfirmasi reservasi akan dikirim via email dan WhatsApp
                    </li>
                    <li>• Mohon datang 15 menit sebelum waktu reservasi</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white flex items-center gap-3">
                  <Users className="w-6 h-6 text-amber-600" />
                  Informasi Personal
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                      placeholder="nama@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                      Nomor Telepon *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                      placeholder="08XXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                      Jumlah Tamu
                    </label>
                    <input
                      type="number"
                      name="guestCount"
                      value={formData.guestCount}
                      onChange={handleInputChange}
                      min="1"
                      max={selectedTable?.capacity || 10}
                      className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Room Selection */}
              <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-amber-600" />
                  Pilih Ruangan
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {rooms.map((room) => (
                    <div
                      key={room.type}
                      onClick={() => handleRoomSelect(room)}
                      className={`p-6 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                        selectedRoom?.type === room.type
                          ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                          : "border-neutral-200 dark:border-neutral-600 hover:border-amber-300"
                      }`}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className={`p-3 rounded-xl ${
                            selectedRoom?.type === room.type
                              ? "bg-amber-500 text-white"
                              : "bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400"
                          }`}
                        >
                          {getRoomIcon(room.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                            {room.name}
                          </h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {room.tables.length} meja tersedia
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                        {room.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {room.features?.slice(0, 3).map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                        {(room.features?.length || 0) > 3 && (
                          <span className="px-2 py-1 text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 rounded-full">
                            +{(room.features?.length || 0) - 3} lainnya
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Table Selection */}
              {selectedRoom && (
                <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-xl">
                  <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">
                    Pilih Meja - {selectedRoom.name}
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedRoom.tables.map((table) => (
                      <div
                        key={table.table_number}
                        onClick={() => handleTableSelect(table)}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                          selectedTable?.table_number === table.table_number
                            ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                            : "border-neutral-200 dark:border-neutral-600 hover:border-amber-300"
                        }`}
                      >
                        <div className="text-center">
                          <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">
                            {table.table_number}
                          </h4>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                            Kapasitas: {table.capacity} orang
                          </p>
                          <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-2">
                            {table.formatted_price}/jam
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-3">
                            {table.description}
                          </p>
                          {table.features && (
                            <div className="flex flex-wrap gap-1 justify-center">
                              {table.features.map((feature, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Date & Time Selection */}
              {selectedTable && (
                <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-xl">
                  <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-amber-600" />
                    Waktu Reservasi
                  </h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                        Tanggal *
                      </label>
                      <input
                        type="date"
                        name="reservationDate"
                        value={formData.reservationDate}
                        onChange={handleInputChange}
                        min={today}
                        max={maxDateStr}
                        required
                        className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                        Waktu Mulai *
                      </label>
                      <input
                        type="time"
                        name="reservationTime"
                        value={formData.reservationTime}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                        Durasi (Jam)
                      </label>
                      <select
                        name="durationHours"
                        value={formData.durationHours}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                      >
                        <option value={1}>1 Jam</option>
                        <option value={2}>2 Jam</option>
                        <option value={3}>3 Jam</option>
                        <option value={4}>4 Jam</option>
                        <option value={6}>6 Jam</option>
                        <option value={8}>8 Jam</option>
                      </select>
                    </div>
                  </div>

                  {formData.reservationDate && formData.reservationTime && (
                    <div className="mt-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-600">
                      {checkingAvailability ? (
                        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                          <div className="animate-spin w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full"></div>
                          Memeriksa ketersediaan...
                        </div>
                      ) : availability !== null ? (
                        <div
                          className={`flex items-center gap-2 ${
                            availability ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          <div
                            className={`w-3 h-3 rounded-full ${
                              availability ? "bg-green-500" : "bg-red-500"
                            }`}
                          ></div>
                          {availability ? "Tersedia" : "Tidak tersedia"}
                        </div>
                      ) : null}
                    </div>
                  )}

                  <div className="mt-6">
                    <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                      Permintaan Khusus
                    </label>
                    <textarea
                      name="specialRequest"
                      value={formData.specialRequest}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white resize-none"
                      placeholder="Permintaan khusus (opsional)"
                    />
                  </div>
                </div>
              )}

              {/* Price Summary */}
              {selectedRoom && selectedTable && formData.durationHours && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-8 shadow-xl border border-amber-200 dark:border-amber-800">
                  <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-amber-600" />
                    Ringkasan Biaya
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-amber-200 dark:border-amber-800">
                      <span className="text-neutral-700 dark:text-neutral-300">
                        Ruangan:
                      </span>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {selectedRoom.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-amber-200 dark:border-amber-800">
                      <span className="text-neutral-700 dark:text-neutral-300">
                        Meja:
                      </span>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {selectedTable.table_number}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-amber-200 dark:border-amber-800">
                      <span className="text-neutral-700 dark:text-neutral-300">
                        Durasi:
                      </span>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {formData.durationHours} jam
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-amber-200 dark:border-amber-800">
                      <span className="text-neutral-700 dark:text-neutral-300">
                        Tarif per jam:
                      </span>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {formatCurrency(selectedTable.price_per_hour)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl px-4">
                      <span className="text-lg font-semibold text-neutral-900 dark:text-white">
                        Total:
                      </span>
                      <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {formatCurrency(calculateTotalPrice())}
                      </span>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-2">
                      <Star className="w-4 h-4" />
                      <span className="font-medium">Termasuk dalam paket:</span>
                    </div>
                    <ul className="text-sm text-green-600 dark:text-green-300 space-y-1">
                      <li>• WiFi unlimited berkecepatan tinggi</li>
                      <li>• Coffee & tea gratis</li>
                      <li>• Akses toilet dan pantry</li>
                      <li>• Free parking untuk mobil dan motor</li>
                    </ul>
                  </div>
                  <div className="mt-4 p-3 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-sm">
                    <strong>Catatan Penting:</strong>
                    <br />
                    Silakan simpan dan bawa{" "}
                    <span className="font-semibold">bukti reservasi</span> Anda.
                    Pembayaran dilakukan langsung saat kedatangan di lokasi
                    café. Tunjukkan bukti reservasi kepada kasir untuk
                    konfirmasi dan menyelesaikan pembayaran.
                  </div>
                </div>
              )}

              {/* Submit Button */}
              {selectedTable &&
                formData.reservationDate &&
                formData.reservationTime && (
                  <div className="text-center space-y-4">
                    <button
                      type="submit"
                      disabled={loading || availability === false}
                      className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 disabled:from-neutral-400 disabled:to-neutral-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg disabled:hover:scale-100 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Memproses Reservasi...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          Konfirmasi Reservasi
                        </div>
                      )}
                    </button>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
                      Dengan melanjutkan, Anda menyetujui{" "}
                      <a
                        href="#"
                        className="text-amber-600 hover:text-amber-700 underline"
                      >
                        syarat dan ketentuan
                      </a>{" "}
                      serta{" "}
                      <a
                        href="#"
                        className="text-amber-600 hover:text-amber-700 underline"
                      >
                        kebijakan privasi
                      </a>{" "}
                      kami.
                    </div>
                  </div>
                )}
            </form>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-neutral-50 dark:bg-neutral-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8 text-neutral-900 dark:text-white">
              Butuh Bantuan?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                  Telepon
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-2">
                  Hubungi customer service kami
                </p>
                <a
                  href="tel:+6281234567890"
                  className="text-amber-600 hover:text-amber-700 font-medium"
                >
                  +62 812-3456-7890
                </a>
              </div>
              <div className="text-center p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                  Email
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-2">
                  Kirim pertanyaan via email
                </p>
                <a
                  href="mailto:reservasi@workspace.com"
                  className="text-amber-600 hover:text-amber-700 font-medium"
                >
                  reservasi@workspace.com
                </a>
              </div>
              <div className="text-center p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                  FAQ
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-2">
                  Temukan jawaban cepat
                </p>
                <a
                  href="#"
                  className="text-amber-600 hover:text-amber-700 font-medium"
                >
                  Lihat FAQ
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operating Hours */}
      <section className="py-12 bg-white dark:bg-neutral-800">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white flex items-center justify-center gap-3">
              <Clock className="w-6 h-6 text-amber-600" />
              Jam Operasional
            </h2>
            <div className="bg-neutral-50 dark:bg-neutral-700 rounded-xl p-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-left">
                  <div className="font-medium text-neutral-900 dark:text-white mb-1">
                    Senin - Jumat
                  </div>
                  <div className="text-neutral-600 dark:text-neutral-400">
                    08:00 - 22:00
                  </div>
                </div>
                <div className="text-left">
                  <div className="font-medium text-neutral-900 dark:text-white mb-1">
                    Sabtu - Minggu
                  </div>
                  <div className="text-neutral-600 dark:text-neutral-400">
                    09:00 - 21:00
                  </div>
                </div>
                <div className="text-left">
                  <div className="font-medium text-neutral-900 dark:text-white mb-1">
                    Hari Libur Nasional
                  </div>
                  <div className="text-neutral-600 dark:text-neutral-400">
                    10:00 - 20:00
                  </div>
                </div>
                <div className="text-left">
                  <div className="font-medium text-neutral-900 dark:text-white mb-1">
                    24/7 Access
                  </div>
                  <div className="text-amber-600 dark:text-amber-400">
                    Premium member
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>
        {`
          @keyframes caffeineBlink {
            0%,
            100% {
              color: #fbbf24;
              text-shadow: 0 0 8px #fbbf24;
            }
            50% {
              color: #f59e0b;
              text-shadow: 0 0 16px #f59e0b;
            }
          }
          .caffeine-blink {
            animation: caffeineBlink 2s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}
