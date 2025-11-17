import { Head, router, usePage } from '@inertiajs/react';
import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
    CalendarIcon,
    ArrowRightOnRectangleIcon as LogOut,
    UserCircleIcon as User,
    HomeIcon,
    XMarkIcon,
    UsersIcon,
    MapPinIcon,
    CheckCircleIcon,
    BellIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { route } from 'ziggy-js';

type Room = {
    id: number;
    name: string;
    capacity: number;
    facilities: string | null;
    location: string | null;
    photo: string | null;
};

type Notification = {
    id: number;
    title: string;
    room: string;
    status: 'approved' | 'rejected';
    message: string;
    created_at: string;
    read: boolean;
};

type Reservation = {
    id: number;
    title: string;
    room: string;
    start: string;
    end: string;
    status: 'pending' | 'approved' | 'rejected';
};

type Props = {
    rooms: Room[];
    notifications?: Notification[];
    reservations?: Reservation[];
};

export default function ReservationsHome({ rooms, notifications = [], reservations = [] }: Props) {
    const { auth, flash } = usePage().props as any;
    const user = auth.user;

    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    const goToCalendar = () => {
        if (selectedRoom) {
            router.visit(route('room.calendar', selectedRoom.id));
        }
    };

    const parseFacilities = (facilities: string | null): string[] => {
        if (!facilities) return [];
        return facilities.split(',').map(f => f.trim()).filter(Boolean);
    };

    const markAsRead = (notificationId: number) => {
        router.patch(route('notifications.read', notificationId), {}, {
            preserveScroll: true,
            only: ['notifications']
        });
    };

    const cancelReservation = (reservationId: number) => {
        if (confirm('Apakah Anda yakin ingin membatalkan reservasi ini?')) {
            router.delete(route('reservations.cancel', reservationId), {
                onSuccess: () => {
                    router.reload({ only: ['reservations', 'notifications'] });
                }
            });
        }
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <>
            <Head title="Pilih Ruangan" />

            {/* HEADER dengan Notifikasi & History */}
            {/* HEADER - Simple & Clean (sama seperti halaman Calendar) */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo & Title */}
                        <div className="flex items-center space-x-3">
                            <CalendarIcon className="w-7 h-7 text-blue-600" />
                            <h1 className="text-lg font-semibold text-gray-900">
                                Reservasi<span className="text-blue-600">Ruang</span>
                            </h1>
                        </div>

                        {/* Right Menu - Notifikasi + History + User */}
                        <div className="flex items-center space-x-4">
                            {/* Notifikasi */}
                            <button
                                onClick={() => setNotificationOpen(true)}
                                className="relative p-2 rounded-lg hover:bg-gray-100 transition"
                            >
                                <BellIcon className="w-6 h-6 text-gray-600" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* History */}
                            <button
                                onClick={() => setHistoryOpen(true)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition"
                            >
                                <ClockIcon className="w-6 h-6 text-gray-600" />
                            </button>

                            {/* User Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                                >
                                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                        <a href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                            <User className="w-4 h-4 mr-2 text-gray-500" />
                                            Profil
                                        </a>
                                        <a href="/" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                            <HomeIcon className="w-4 h-4 mr-2 text-gray-500" />
                                            Beranda
                                        </a>
                                        <hr className="my-1 border-gray-200" />
                                        <button
                                            onClick={() => router.post(route('logout'))}
                                            className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Keluar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Flash Message */}
            {flash?.success && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                    <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg">
                        {flash.success}
                    </div>
                </div>
            )}

            {/* KONTEN UTAMA */}
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                            Reservasi Ruangan
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base">
                            Pilih ruangan yang tersedia
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {rooms.map((room) => (
                            <div
                                key={room.id}
                                onClick={() => setSelectedRoom(room)}
                                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer border border-gray-200"
                            >
                                <div className="h-48 sm:h-56 relative overflow-hidden bg-gray-100">
                                    {room.photo ? (
                                        <img
                                            src={`/storage/${room.photo}`}
                                            alt={room.name}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-500 to-indigo-600">
                                            <div className="text-center text-white">
                                                <svg className="w-16 h-16 mx-auto mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                <p className="text-sm font-medium">No Image</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                                        {room.name}
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-gray-600 text-sm">
                                            <UsersIcon className="h-5 w-5 mr-2 text-blue-600 shrink-0" />
                                            <span>{room.capacity} orang</span>
                                        </div>
                                        <div className="flex items-center text-gray-600 text-sm">
                                            <MapPinIcon className="h-5 w-5 mr-2 text-blue-600 shrink-0" />
                                            <span>{room.location || 'Lokasi tidak tersedia'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* MODAL DETAIL RUANGAN */}
                <Transition show={!!selectedRoom} as={Fragment}>
                    <Dialog as="div" className="relative z-50" onClose={() => setSelectedRoom(null)}>
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <div className="fixed inset-0 bg-black bg-opacity-50" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
                                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-full sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-full sm:translate-y-0 sm:scale-95">
                                    <Dialog.Panel className="w-full sm:max-w-2xl bg-white sm:rounded-2xl shadow-xl overflow-hidden max-h-screen sm:max-h-[90vh] flex flex-col">
                                        {selectedRoom && (
                                            <>
                                                <div className="h-56 sm:h-72 relative overflow-hidden bg-gray-100 shrink-0">
                                                    {selectedRoom.photo ? (
                                                        <img src={`/storage/${selectedRoom.photo}`} alt={selectedRoom.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-500 to-indigo-600">
                                                            <div className="text-center text-white">
                                                                <svg className="w-24 h-24 mx-auto mb-3 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                                </svg>
                                                                <p className="text-lg font-medium">Tidak ada gambar</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <button onClick={() => setSelectedRoom(null)} className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition">
                                                        <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
                                                    </button>
                                                </div>

                                                <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">{selectedRoom.name}</h2>

                                                    <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6">
                                                        <div className="bg-blue-50 rounded-lg p-4">
                                                            <p className="text-gray-600 text-xs sm:text-sm mb-1">Kapasitas</p>
                                                            <p className="text-xl sm:text-2xl font-bold text-blue-600">{selectedRoom.capacity}</p>
                                                            <p className="text-gray-600 text-xs sm:text-sm">orang</p>
                                                        </div>
                                                        <div className="bg-gray-50 rounded-lg p-4">
                                                            <p className="text-gray-600 text-xs sm:text-sm mb-1">Lokasi</p>
                                                            <p className="text-base sm:text-lg font-semibold text-gray-900 break-words">{selectedRoom.location || '-'}</p>
                                                        </div>
                                                    </div>

                                                    <div className="mb-6">
                                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Fasilitas</h3>
                                                        {parseFacilities(selectedRoom.facilities).length > 0 ? (
                                                            <ul className="space-y-2">
                                                                {parseFacilities(selectedRoom.facilities).map((f, i) => (
                                                                    <li key={i} className="flex items-start">
                                                                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                                                                        <span className="text-sm sm:text-base text-gray-700">{f}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p className="text-sm sm:text-base text-gray-500 italic">Tidak ada fasilitas khusus</p>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={goToCalendar}
                                                        className="w-full py-3 sm:py-4 bg-blue-600 text-white font-semibold text-base sm:text-lg rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                                                    >
                                                        Lanjut Reservasi
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>

                {/* MODAL NOTIFIKASI */}
                <Transition show={notificationOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-50" onClose={() => setNotificationOpen(false)}>
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <div className="fixed inset-0 bg-black bg-opacity-50" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4">
                                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                    <Dialog.Panel className="w-full max-w-md bg-white rounded-2xl shadow-xl">
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h2 className="text-xl font-bold text-gray-900">Notifikasi</h2>
                                                <button onClick={() => setNotificationOpen(false)} className="text-gray-400 hover:text-gray-600">
                                                    <XMarkIcon className="h-6 w-6" />
                                                </button>
                                            </div>

                                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                                {notifications.length === 0 ? (
                                                    <p className="text-center text-gray-500 py-8">Tidak ada notifikasi</p>
                                                ) : (
                                                    notifications.map((notif) => (
                                                        <div
                                                            key={notif.id}
                                                            onClick={() => markAsRead(notif.id)}
                                                            className={`p-4 rounded-lg border cursor-pointer transition ${
                                                                notif.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-300'
                                                            }`}
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <p className="font-semibold text-gray-900">{notif.title}</p>
                                                                    <p className="text-sm text-gray-600 mt-1">{notif.room}</p>
                                                                    <p className="text-sm text-gray-500 mt-2">{notif.message}</p>
                                                                    <p className="text-xs text-gray-400 mt-2">
                                                                        {new Date(notif.created_at).toLocaleString('id-ID')}
                                                                    </p>
                                                                </div>
                                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(notif.status)}`}>
                                                                    {notif.status.toUpperCase()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>

                {/* MODAL HISTORY */}
                <Transition show={historyOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-50" onClose={() => setHistoryOpen(false)}>
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <div className="fixed inset-0 bg-black bg-opacity-50" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4">
                                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                    <Dialog.Panel className="w-full max-w-3xl bg-white rounded-2xl shadow-xl">
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h2 className="text-xl font-bold text-gray-900">History Reservasi</h2>
                                                <button onClick={() => setHistoryOpen(false)} className="text-gray-400 hover:text-gray-600">
                                                    <XMarkIcon className="h-6 w-6" />
                                                </button>
                                            </div>

                                            <div className="space-y-3 max-h-[500px] overflow-y-auto">
                                                {reservations.length === 0 ? (
                                                    <p className="text-center text-gray-500 py-8">Belum ada reservasi</p>
                                                ) : (
                                                    reservations.map((res) => (
                                                        <div key={res.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <h3 className="font-semibold text-gray-900">{res.title}</h3>
                                                                    <p className="text-sm text-gray-600 mt-1">{res.room}</p>
                                                                    <p className="text-sm text-gray-500 mt-2">
                                                                        {new Date(res.start).toLocaleString('id-ID')} <br />
                                                                        s/d {new Date(res.end).toLocaleString('id-ID')}
                                                                    </p>
                                                                </div>
                                                                <div className="flex flex-col items-end gap-2">
                                                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(res.status)}`}>
                                                                        {res.status.toUpperCase()}
                                                                    </span>
                                                                    {(res.status === 'pending' || res.status === 'approved') && (
                                                                        <button
                                                                            onClick={() => cancelReservation(res.id)}
                                                                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                                        >
                                                                            Batalkan
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </>
    );
}