"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  Eye,
  Edit,
  Star,
  X,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

// Types
interface Reservation {
  id: number;
  reservation_number: string;
  customer_name: string;
  email: string;
  phone: string;
  reservation_date: string;
  reservation_time: string;
  duration_hours: number;
  room_type: string;
  table_number: string;
  guest_count: number;
  special_request: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no-show";
  status_name: string;
  room_name: string;
  formatted_date: string;
  formatted_time: string;
  end_time: string;
  table_description: string;
  table_capacity: number;
  created_at: string;
  updated_at: string;
  price_per_hour: number; // Added
  total_price: number; // Added
}

interface ReservationHistory {
  id: number;
  reservation_id: number;
  action: "created" | "rescheduled" | "cancelled" | "confirmed" | "completed";
  old_date?: string;
  old_time?: string;
  new_date?: string;
  new_time?: string;
  notes?: string;
  created_at: string;
}

interface RescheduleForm {
  newDate: string;
  newTime: string;
  durationHours: number;
}

export default function ReservationHistory() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [reservationHistory, setReservationHistory] = useState<
    ReservationHistory[]
  >([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [rescheduleForm, setRescheduleForm] = useState<RescheduleForm>({
    newDate: "",
    newTime: "",
    durationHours: 2,
  });
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/reservations/user/my-reservations",
        {
          credentials: "include",
        }
      );
      const data = await response.json();

      if (data.success) {
        setReservations(data.data);
      } else {
        toast({
          title: "Error",
          description: data.error || "Gagal mengambil data reservasi",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengambil data reservasi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReservationHistory = async (reservationId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/reservations/${reservationId}/history`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();

      if (data.success) {
        setReservationHistory(data.data);
      } else {
        throw new Error("Failed to fetch reservation history");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengambil riwayat reservasi",
        variant: "destructive",
      });
    }
  };

  const handleViewHistory = async (reservation: Reservation) => {
    setSelectedReservation(reservation);
    await fetchReservationHistory(reservation.id);
    setShowHistoryModal(true);
  };

  const handleViewReceipt = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowReceiptModal(true);
  };

  const handleReschedule = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setRescheduleForm({
      newDate: "",
      newTime: "",
      durationHours: reservation.duration_hours,
    });
    setShowRescheduleModal(true);
  };

  const submitReschedule = async () => {
    if (
      !selectedReservation ||
      !rescheduleForm.newDate ||
      !rescheduleForm.newTime
    ) {
      toast({
        title: "Error",
        description: "Silakan lengkapi tanggal dan waktu baru",
        variant: "destructive",
      });
      return;
    }

    setRescheduleLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/reservations/${selectedReservation.id}/reschedule`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(rescheduleForm),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Berhasil!",
          description: "Reservasi berhasil dijadwal ulang",
          variant: "default",
        });
        setShowRescheduleModal(false);
        fetchReservations(); // Refresh data
      } else {
        toast({
          title: "Error",
          description: data.error || "Gagal menjadwal ulang reservasi",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menjadwal ulang reservasi",
        variant: "destructive",
      });
    } finally {
      setRescheduleLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId: number) => {
    if (!confirm("Apakah Anda yakin ingin membatalkan reservasi ini?")) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/reservations/${reservationId}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ reason: "Dibatalkan oleh customer" }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Berhasil!",
          description: "Reservasi berhasil dibatalkan",
          variant: "default",
        });
        fetchReservations(); // Refresh data
      } else {
        toast({
          title: "Error",
          description: data.error || "Gagal membatalkan reservasi",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat membatalkan reservasi",
        variant: "destructive",
      });
    }
  };

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.customer_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reservation.reservation_number
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || reservation.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      confirmed:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      completed:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      "no-show":
        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const formatHistoryAction = (action: string) => {
    const actions = {
      created: "Reservasi Dibuat",
      rescheduled: "Dijadwal Ulang",
      cancelled: "Dibatalkan",
      confirmed: "Dikonfirmasi",
      completed: "Selesai",
    };
    return actions[action as keyof typeof actions] || action;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Memuat data reservasi...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Riwayat Reservasi
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Kelola dan pantau semua reservasi Anda
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Kembali ke Beranda
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau nomor reservasi..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              className="pl-10 pr-8 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu Konfirmasi</option>
              <option value="confirmed">Dikonfirmasi</option>
              <option value="completed">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
              <option value="no-show">Tidak Hadir</option>
            </select>
          </div>
        </div>

        {/* Reservations List */}
        <div className="space-y-4">
          {filteredReservations.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-lg">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || statusFilter !== "all"
                  ? "Tidak ada reservasi yang sesuai dengan filter"
                  : "Belum ada reservasi"}
              </p>
            </div>
          ) : (
            filteredReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {reservation.reservation_number}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          reservation.status
                        )}`}
                      >
                        {reservation.status_name}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{reservation.formatted_date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {reservation.formatted_time} - {reservation.end_time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {reservation.room_name} - {reservation.table_number}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{reservation.guest_count} orang</span>
                      </div>
                    </div>

                    {reservation.special_request && (
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <strong>Permintaan khusus:</strong>{" "}
                        {reservation.special_request}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewReceipt(reservation)}
                      className="px-3 py-1 text-sm bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors flex items-center gap-1"
                    >
                      <FileText className="h-4 w-4" />
                      Bukti
                    </button>
                    <button
                      onClick={() => handleViewHistory(reservation)}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      Riwayat
                    </button>

                    {(reservation.status === "pending" ||
                      reservation.status === "confirmed") && (
                      <>
                        <button
                          onClick={() => handleReschedule(reservation)}
                          className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors flex items-center gap-1"
                        >
                          <Edit className="h-4 w-4" />
                          Ubah
                        </button>

                        <button
                          onClick={() =>
                            handleCancelReservation(reservation.id)
                          }
                          className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors flex items-center gap-1"
                        >
                          <X className="h-4 w-4" />
                          Batal
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceiptModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 print:hidden">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Bukti Reservasi
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors flex items-center gap-1"
                >
                  <FileText className="h-4 w-4" />
                  Print
                </button>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto max-h-[75vh] print:max-h-none print:overflow-visible">
              {/* Receipt Header */}
              <div className="text-center mb-8 border-b-2 border-amber-500 pb-6">
                <h1 className="text-3xl font-bold text-amber-600 mb-2">
                  &lt;Caffeine/&gt;
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Jl. Contoh No. 123, Kota, Provinsi 12345
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Telp: (021) 1234-5678 | Email: info@restaurant.com
                </p>
                <div className="mt-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    BUKTI RESERVASI
                  </h2>
                </div>
              </div>

              {/* Receipt Content */}
              <div className="mb-6">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <td className="py-3 font-semibold text-gray-700 dark:text-gray-300 w-1/3">
                        No. Reservasi
                      </td>
                      <td className="py-3 text-center px-4">:</td>
                      <td className="py-3 text-gray-900 dark:text-white font-mono text-lg">
                        {selectedReservation.reservation_number}
                      </td>
                    </tr>

                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <td className="py-3 font-semibold text-gray-700 dark:text-gray-300">
                        Nama Pelanggan
                      </td>
                      <td className="py-3 text-center px-4">:</td>
                      <td className="py-3 text-gray-900 dark:text-white">
                        {selectedReservation.customer_name}
                      </td>
                    </tr>

                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <td className="py-3 font-semibold text-gray-700 dark:text-gray-300">
                        Email
                      </td>
                      <td className="py-3 text-center px-4"></td>
                      <td className="py-3 text-gray-900 dark:text-white">
                        {selectedReservation.email}
                      </td>
                    </tr>

                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <td className="py-3 font-semibold text-gray-700 dark:text-gray-300">
                        No. Telepon
                      </td>
                      <td className="py-3 text-center px-4"></td>
                      <td className="py-3 text-gray-900 dark:text-white">
                        {selectedReservation.phone}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Reservation Details */}
              <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-4 text-center">
                  DETAIL RESERVASI
                </h3>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-amber-200 dark:border-amber-700">
                      <td className="py-3 font-semibold text-gray-700 dark:text-gray-300 w-1/3">
                        Tanggal
                      </td>
                      <td className="py-3 text-center px-4"></td>
                      <td className="py-3 text-gray-900 dark:text-white font-semibold">
                        {selectedReservation.formatted_date}
                      </td>
                    </tr>

                    <tr className="border-b border-amber-200 dark:border-amber-700">
                      <td className="py-3 font-semibold text-gray-700 dark:text-gray-300">
                        Waktu
                      </td>
                      <td className="py-3 text-center px-4"></td>
                      <td className="py-3 text-gray-900 dark:text-white font-semibold">
                        {selectedReservation.formatted_time} -{" "}
                        {selectedReservation.end_time}
                      </td>
                    </tr>

                    <tr className="border-b border-amber-200 dark:border-amber-700">
                      <td className="py-3 font-semibold text-gray-700 dark:text-gray-300">
                        Durasi
                      </td>
                      <td className="py-3 text-center px-4"></td>
                      <td className="py-3 text-gray-900 dark:text-white">
                        {selectedReservation.duration_hours} jam
                      </td>
                    </tr>

                    <tr className="border-b border-amber-200 dark:border-amber-700">
                      <td className="py-3 font-semibold text-gray-700 dark:text-gray-300">
                        Ruangan
                      </td>
                      <td className="py-3 text-center px-4"></td>
                      <td className="py-3 text-gray-900 dark:text-white">
                        {selectedReservation.room_name}
                      </td>
                    </tr>

                    <tr className="border-b border-amber-200 dark:border-amber-700">
                      <td className="py-3 font-semibold text-gray-700 dark:text-gray-300">
                        Meja
                      </td>
                      <td className="py-3 text-center px-4"></td>
                      <td className="py-3 text-gray-900 dark:text-white">
                        {selectedReservation.table_number}
                      </td>
                    </tr>

                    <tr className="border-b border-amber-200 dark:border-amber-700">
                      <td className="py-3 font-semibold text-gray-700 dark:text-gray-300">
                        Tipe Meja
                      </td>
                      <td className="py-3 text-center px-4"></td>
                      <td className="py-3 text-gray-900 dark:text-white">
                        {selectedReservation.table_description}
                      </td>
                    </tr>

                    <tr className="border-b border-amber-200 dark:border-amber-700">
                      <td className="py-3 font-semibold text-gray-700 dark:text-gray-300">
                        Kapasitas Meja
                      </td>
                      <td className="py-3 text-center px-4"></td>
                      <td className="py-3 text-gray-900 dark:text-white">
                        {selectedReservation.table_capacity} orang
                      </td>
                    </tr>

                    <tr className="border-b border-amber-200 dark:border-amber-700">
                      <td className="py-3 font-semibold text-gray-700 dark:text-gray-300">
                        Jumlah Tamu
                      </td>
                      <td className="py-3 text-center px-4"></td>
                      <td className="py-3 text-gray-900 dark:text-white font-semibold text-lg">
                        {selectedReservation.guest_count} orang
                      </td>
                    </tr>

                    <tr className="border-b border-amber-200 dark:border-amber-700">
                      <td className="py-3 font-semibold text-gray-700 dark:text-gray-300">
                        Harga per Jam
                      </td>
                      <td className="py-3 text-center px-4"></td>
                      <td className="py-3 text-gray-900 dark:text-white font-semibold">
                        Rp{" "}
                        {selectedReservation.price_per_hour.toLocaleString(
                          "id-ID"
                        )}
                      </td>
                    </tr>

                    <tr className="border-b border-amber-200 dark:border-amber-700">
                      <td className="py-3 font-semibold text-gray-700 dark:text-gray-300">
                        Total Harga
                      </td>
                      <td className="py-3 text-center px-4"></td>
                      <td className="py-3 text-gray-900 dark:text-white font-semibold text-lg">
                        Rp{" "}
                        {selectedReservation.total_price.toLocaleString(
                          "id-ID"
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Special Request */}
              {selectedReservation.special_request && (
                <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    PERMINTAAN KHUSUS
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 italic">
                    "{selectedReservation.special_request}"
                  </p>
                </div>
              )}

              {/* Status */}
              <div className="mb-6">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <td className="py-3 font-semibold text-gray-700 dark:text-gray-300 w-1/3">
                        Status
                      </td>
                      <td className="py-3 text-center px-4"></td>
                      <td className="py-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                            selectedReservation.status
                          )}`}
                        >
                          {selectedReservation.status_name}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Timestamps */}
              <div className="mb-6 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600 pt-4">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="py-2 w-1/3">Dibuat pada</td>
                      <td className="py-2 text-center px-4"></td>
                      <td className="py-2">
                        {new Date(
                          selectedReservation.created_at
                        ).toLocaleString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">Terakhir diperbarui</td>
                      <td className="py-2 text-center px-4"></td>
                      <td className="py-2">
                        {new Date(
                          selectedReservation.updated_at
                        ).toLocaleString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">Dicetak pada</td>
                      <td className="py-2 text-center px-4"></td>
                      <td className="py-2">
                        {new Date().toLocaleString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Footer */}
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

              <div className="text-center border-t-2 border-amber-500 pt-6 mt-8">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  Terima kasih atas kepercayaan Anda!
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-xs">
                  Bukti ini adalah konfirmasi resmi reservasi Anda.
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-xs">
                  Mohon tunjukkan bukti ini saat kedatangan untuk proses
                  konfirmasi.
                </p>
                <p className="text-yellow-700 dark:text-yellow-400 text-xs mt-2">
                  ⚠️ Pembayaran dilakukan langsung di lokasi café. Harap membawa
                  bukti reservasi dalam bentuk digital (screenshot/email) atau
                  cetak untuk ditunjukkan kepada kasir saat check-in.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 print:hidden">
              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Print Bukti
                </button>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* History Modal */}
      {showHistoryModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Riwayat Reservasi {selectedReservation.reservation_number}
              </h2>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                {reservationHistory.map((history) => (
                  <div
                    key={history.id}
                    className="border-l-4 border-amber-500 pl-4 py-2"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {formatHistoryAction(history.action)}
                      </h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(history.created_at).toLocaleString("id-ID")}
                      </span>
                    </div>

                    {history.action === "rescheduled" &&
                      history.old_date &&
                      history.new_date && (
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          <p>
                            Dari:{" "}
                            {new Date(history.old_date).toLocaleDateString(
                              "id-ID"
                            )}{" "}
                            {history.old_time}
                          </p>
                          <p>
                            Ke:{" "}
                            {new Date(history.new_date).toLocaleDateString(
                              "id-ID"
                            )}{" "}
                            {history.new_time}
                          </p>
                        </div>
                      )}

                    {history.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {history.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Reschedule Modal */}
      {showRescheduleModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Jadwal Ulang Reservasi
              </h2>
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tanggal Baru
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={rescheduleForm.newDate}
                  onChange={(e) =>
                    setRescheduleForm({
                      ...rescheduleForm,
                      newDate: e.target.value,
                    })
                  }
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Waktu Baru
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={rescheduleForm.newTime}
                  onChange={(e) =>
                    setRescheduleForm({
                      ...rescheduleForm,
                      newTime: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Durasi (jam)
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={rescheduleForm.durationHours}
                  onChange={(e) =>
                    setRescheduleForm({
                      ...rescheduleForm,
                      durationHours: parseInt(e.target.value),
                    })
                  }
                >
                  <option value={1}>1 jam</option>
                  <option value={2}>2 jam</option>
                  <option value={3}>3 jam</option>
                  <option value={4}>4 jam</option>
                  <option value={6}>6 jam</option>
                  <option value={8}>8 jam</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowRescheduleModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  disabled={rescheduleLoading}
                >
                  Batal
                </button>
                <button
                  onClick={submitReschedule}
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={rescheduleLoading}
                >
                  {rescheduleLoading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
