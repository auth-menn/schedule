import { Head, router } from '@inertiajs/react';
import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, UsersIcon, MapPinIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { route } from 'ziggy-js';

type Room = {
    id: number;
    name: string;
    capacity: number;
    facilities: string | null;
    location: string | null;
    photo: string | null;
};

type Props = {
    rooms: Room[];
};

export default function Home({ rooms }: Props) {
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    const goToCalendar = () => {
        if (selectedRoom) {
            router.visit(route('room.calendar', selectedRoom.id));
        }
    };

    // Parse facilities string menjadi array
    const parseFacilities = (facilities: string | null): string[] => {
        if (!facilities) return [];
        return facilities.split(',').map(f => f.trim()).filter(f => f.length > 0);
    };

    return (
        <>
            <Head title="Pilih Ruangan" />

            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header - Lebih Simple */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                            Reservasi Ruangan
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base">
                            Pilih ruangan yang tersedia
                        </p>
                    </div>

                    {/* Grid Ruangan - Responsif */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {rooms.map((room) => (
                            <div
                                key={room.id}
                                onClick={() => setSelectedRoom(room)}
                                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer border border-gray-200"
                            >
                                {/* Gambar Ruangan */}
                                <div className="h-48 sm:h-56 relative overflow-hidden bg-gray-100">
                                    {room.photo ? (
                                        <img
                                            src={`/storage/${room.photo}`}
                                            alt={room.name}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement!.innerHTML = `
                                                    <div class="flex items-center justify-center h-full bg-linear-to-br from-blue-500 to-indigo-600">
                                                        <div class="text-center text-white">
                                                            <svg class="w-16 h-16 mx-auto mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                            </svg>
                                                            <p class="text-sm font-medium">Image Not Found</p>
                                                        </div>
                                                    </div>
                                                `;
                                            }}
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full bg-linear-to-br from-blue-500 to-indigo-600">
                                            <div className="text-center text-white">
                                                <svg className="w-16 h-16 mx-auto mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                <p className="text-sm font-medium">No Image</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Info Ruangan - Simple */}
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

                {/* Modal Detail Ruangan - Responsif */}
                <Transition show={!!selectedRoom} as={Fragment}>
                    <Dialog as="div" className="relative z-50" onClose={() => setSelectedRoom(null)}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-50" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 translate-y-full sm:translate-y-0 sm:scale-95"
                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                    leaveTo="opacity-0 translate-y-full sm:translate-y-0 sm:scale-95"
                                >
                                    <Dialog.Panel className="w-full sm:max-w-2xl bg-white sm:rounded-2xl shadow-xl overflow-hidden max-h-screen sm:max-h-[90vh] flex flex-col">
                                        {selectedRoom && (
                                            <>
                                                {/* Gambar Header */}
                                                <div className="h-56 sm:h-72 relative overflow-hidden bg-gray-100 shrink-0">
                                                    {selectedRoom.photo ? (
                                                        <img
                                                            src={`/storage/${selectedRoom.photo}`}
                                                            alt={selectedRoom.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                                e.currentTarget.parentElement!.innerHTML = `
                                                                    <div class="flex items-center justify-center h-full bg-linear-to-br from-blue-500 to-indigo-600">
                                                                        <div class="text-center text-white">
                                                                            <svg class="w-24 h-24 mx-auto mb-3 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                                            </svg>
                                                                            <p class="text-lg font-medium">Image Not Found</p>
                                                                        </div>
                                                                    </div>
                                                                `;
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full bg-linear-to-br from-blue-500 to-indigo-600">
                                                            <div className="text-center text-white">
                                                                <svg className="w-24 h-24 mx-auto mb-3 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                                </svg>
                                                                <p className="text-lg font-medium">Tidak ada gambar</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Tombol Close */}
                                                    <button
                                                        onClick={() => setSelectedRoom(null)}
                                                        className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
                                                    >
                                                        <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
                                                    </button>
                                                </div>

                                                {/* Content - Scrollable */}
                                                <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                                                        {selectedRoom.name}
                                                    </h2>

                                                    {/* Info Grid - Responsif */}
                                                    <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6">
                                                        <div className="bg-blue-50 rounded-lg p-4">
                                                            <p className="text-gray-600 text-xs sm:text-sm mb-1">Kapasitas</p>
                                                            <p className="text-xl sm:text-2xl font-bold text-blue-600">
                                                                {selectedRoom.capacity}
                                                            </p>
                                                            <p className="text-gray-600 text-xs sm:text-sm">orang</p>
                                                        </div>
                                                        <div className="bg-gray-50 rounded-lg p-4">
                                                            <p className="text-gray-600 text-xs sm:text-sm mb-1">Lokasi</p>
                                                            <p className="text-base sm:text-lg font-semibold text-gray-900 -wrap-break-words">
                                                                {selectedRoom.location || '-'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Fasilitas - List ke Bawah */}
                                                    <div className="mb-6">
                                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                                                            Fasilitas
                                                        </h3>
                                                        {parseFacilities(selectedRoom.facilities).length > 0 ? (
                                                            <ul className="space-y-2">
                                                                {parseFacilities(selectedRoom.facilities).map((facility, index) => (
                                                                    <li key={index} className="flex items-start">
                                                                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                                                                        <span className="text-sm sm:text-base text-gray-700">
                                                                            {facility}
                                                                        </span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p className="text-sm sm:text-base text-gray-500 italic">
                                                                Tidak ada fasilitas khusus
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Tombol Reservasi */}
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
            </div>
        </>
    );
}