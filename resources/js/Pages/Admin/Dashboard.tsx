// resources/js/Pages/Admin/Dashboard.tsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function Dashboard({ auth, stats, reservations, events }: any) {
    // Fix: ambil user dari auth (karena Breeze kirim { auth: { user } })
    const user = auth.user;

    // Flash message
    const { flash } = usePage().props;

    const handleStatusChange = (reservationId: number, status: 'approved' | 'rejected') => {
        router.patch(
            route('admin.reservations.status', reservationId),
            { status },
            {
                onSuccess: () => {
                    router.reload({ only: ['events', 'reservations', 'stats'] });
                },
            }
        );
    };

    return (
        <AuthenticatedLayout user={user}>
            <Head title="Dashboard Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">
                        Dashboard Admin – Sistem Reservasi Ruangan
                    </h1>

                    {/* Flash Message */}   
                    {flash?.success && (
                        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg">
                            {flash.success}
                        </div>
                    )}

                    {/* Statistik Kartu */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                            <h3 className="text-lg font-medium opacity-90">Total Ruangan</h3>
                            <p className="text-4xl font-bold mt-2">{stats.total_rooms}</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg">
                            <h3 className="text-lg font-medium opacity-90">Reservasi Hari Ini</h3>
                            <p className="text-4xl font-bold mt-2">{stats.today_reservations}</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
                            <h3 className="text-lg font-medium opacity-90">Total Pengguna</h3>
                            <p className="text-4xl font-bold mt-2">{stats.total_users}</p>
                        </div>
                        <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
                            <h3 className="text-lg font-medium opacity-90">Menunggu Approval</h3>
                            <p className="text-4xl font-bold mt-2">{stats.pending_reservations}</p>
                        </div>
                    </div>

                    {/* Kalender */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Kalender Semua Ruangan
                        </h2>
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="timeGridWeek"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay',
                            }}
                            events={events}
                            height="600px"
                            slotMinTime="07:00:00"
                            slotMaxTime="22:00:00"
                            eventClick={(info) => {
                                alert(
                                    `Reservasi: ${info.event.title}\nRuangan: ${info.event.extendedProps.room}\nStatus: ${info.event.extendedProps.status.toUpperCase()}`
                                );
                            }}
                        />
                    </div>

                    {/* Tabel Reservasi */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="px-6 py-4 bg-gray-800 text-white">
                            <h2 className="text-xl font-bold">10 Reservasi Terbaru</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pemesan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ruangan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reservations.map((r: any) => (
                                        <tr key={r.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.title}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{r.user}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{r.room}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(r.start).toLocaleString('id-ID')}
                                                <br />s/d {new Date(r.end).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                    r.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    r.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {r.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {r.status === 'pending' && (
                                                    <div className="flex gap-3">
                                                        <button onClick={() => handleStatusChange(r.id, 'approved')} className="text-green-600 hover:text-green-900 font-medium">
                                                            Approve
                                                        </button>
                                                        <button onClick={() => handleStatusChange(r.id, 'rejected')} className="text-red-600 hover:text-red-900 font-medium">
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}