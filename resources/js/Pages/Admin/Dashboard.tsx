import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage, Link } from '@inertiajs/react';
import { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
    BuildingOfficeIcon,
    CalendarDaysIcon,
    UsersIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard({ auth, stats, reservations, events }: any) {
    const user = auth.user;
    const { flash } = usePage().props as {
        flash?: {
            success?: string;
            error?: string;
        };
    };
    const calendarRef = useRef<FullCalendar>(null);

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

    const handleViewChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const view = e.target.value as 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
        calendarRef.current?.getApi().changeView(view);
    };

    const statsCards = [
        {
            title: 'Total Ruangan',
            value: stats.total_rooms,
            icon: BuildingOfficeIcon,
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            borderColor: 'border-blue-200',
        },
        {
            title: 'Reservasi Hari Ini',
            value: stats.today_reservations,
            icon: CalendarDaysIcon,
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            borderColor: 'border-green-200',
        },
        {
            title: 'Total Pengguna',
            value: stats.total_users,
            icon: UsersIcon,
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            borderColor: 'border-purple-200',
        },
        {
            title: 'Menunggu Approval',
            value: stats.pending_reservations,
            icon: ClockIcon,
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600',
            borderColor: 'border-orange-200',
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard Admin" />

            <div className="py-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Dashboard Admin</h1>
                            <p className="text-sm text-gray-600 mt-1">Kelola sistem reservasi ruangan</p>
                        </div>

                        <Link
                            href={route('admin.rooms.index')}
                            className="flex items-center gap-2.5 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition shadow-sm"
                        >
                            <BuildingOfficeIcon className="w-5 h-5" />
                            Kelola Ruangan
                        </Link>
                    </div>
                    {flash?.success && (
                        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                            <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">{flash.success}</span>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {statsCards.map((stat, index) => (
                            <div
                                key={index}
                                className={`${stat.bgColor} border ${stat.borderColor} rounded-lg p-4`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                    </div>
                                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                                        <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white rounded-lg shadow mb-6">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">Kalender Reservasi</h2>
                                    <p className="text-sm text-gray-600 mt-1">Lihat semua reservasi dari seluruh ruangan</p>
                                </div>
                                <div>
                                    <select
                                        defaultValue="timeGridWeek"
                                        onChange={handleViewChange}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    >
                                        <option value="dayGridMonth">Bulanan</option>
                                        <option value="timeGridWeek">Mingguan</option>
                                        <option value="timeGridDay">Harian</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <FullCalendar
                                ref={calendarRef}
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView="timeGridWeek"
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: '',
                                }}
                                locale="id"
                                slotMinTime="07:00:00"
                                slotMaxTime="22:00:00"
                                height="650px"
                                events={events.map((ev: any) => {
                                    let backgroundColor = '#6366f1';
                                    let borderColor = '#4f46e5';

                                    if (ev.extendedProps?.status === 'approved') {
                                        backgroundColor = '#10b981';
                                        borderColor = '#059669';
                                    } else if (ev.extendedProps?.status === 'rejected') {
                                        backgroundColor = '#ef4444';
                                        borderColor = '#dc2626';
                                    } else if (ev.extendedProps?.status === 'pending') {
                                        backgroundColor = '#f59e0b';
                                        borderColor = '#d97706';
                                    }

                                    return {
                                        ...ev,
                                        backgroundColor,
                                        borderColor,
                                        textColor: '#ffffff',
                                    };
                                })}
                                eventClick={(info) => {
                                    const e = info.event;
                                    const p = e.extendedProps;
                                    const statusText =
                                        p.status === 'approved'
                                            ? 'Disetujui'
                                            : p.status === 'rejected'
                                            ? 'Ditolak'
                                            : 'Menunggu';

                                    alert(
                                        `Judul: ${e.title}\n` +
                                        `Ruangan: ${p.room}\n` +
                                        `Pemesan: ${p.user}\n` +
                                        `Status: ${statusText}\n` +
                                        `Waktu: ${new Date(e.start!).toLocaleString('id-ID')}${
                                            e.end ? ' - ' + new Date(e.end).toLocaleTimeString('id-ID') : ''
                                        }`
                                    );
                                }}
                            />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900">Reservasi Terbaru</h2>
                            <p className="text-sm text-gray-600 mt-1">10 reservasi terakhir yang masuk</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Judul</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Pemesan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ruangan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Waktu</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reservations.map((r: any) => (
                                        <tr key={r.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.title}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{r.user}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{r.room}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs text-gray-600">
                                                    <div>{new Date(r.start).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                                    <div className="text-gray-500">
                                                        {new Date(r.start).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} -{' '}
                                                        {new Date(r.end).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        r.status === 'approved'
                                                            ? 'bg-green-100 text-green-800'
                                                            : r.status === 'rejected'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                                >
                                                    {r.status === 'approved' ? 'Disetujui' : r.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {r.status === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleStatusChange(r.id, 'approved')}
                                                            className="inline-flex items-center px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium rounded-md transition"
                                                        >
                                                            <CheckCircleIcon className="w-4 h-4 mr-1" />
                                                            Setujui
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(r.id, 'rejected')}
                                                            className="inline-flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium rounded-md transition"
                                                        >
                                                            <XCircleIcon className="w-4 h-4 mr-1" />
                                                            Tolak
                                                        </button>
                                                    </div>
                                                )}
                                                {r.status !== 'pending' && <span className="text-xs text-gray-400">-</span>}
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