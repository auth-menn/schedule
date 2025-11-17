// resources/js/Pages/Reservations/Calendar.tsx
import { useState, useRef, useEffect } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
    ChevronDownIcon,
    CheckCircleIcon,
    CalendarIcon,
    ArrowRightOnRectangleIcon as LogOut,
    UserCircleIcon as User,
    HomeIcon,
    BellIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

interface Room {
    id: number;
    name: string;
}

interface Reservation {
    id: number;
    title: string;
    start_time: string;
    end_time: string;
    room_id: number;
    user_id?: number;
}

interface Props {
    selectedRoom: Room;
    rooms: Room[];
    reservations: Reservation[];
    flash?: { success: string };
}

export default function Calendar({ selectedRoom: initialRoom, rooms, reservations, flash }: Props) {
    const { auth } = usePage().props as any;
    const user = auth.user;

    const [selectedRoomId, setSelectedRoomId] = useState<number>(initialRoom.id);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectInfo, setSelectInfo] = useState<any>(null);
    const [currentView, setCurrentView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>('timeGridWeek');
    const [showToast, setShowToast] = useState(!!flash?.success);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const calendarRef = useRef<FullCalendar>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        room_id: String(initialRoom.id),
        title: '',
        start_time: '',
        end_time: '',
    });

    useEffect(() => {
        if (flash?.success) {
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const filteredEvents = reservations
        .filter(r => r.room_id === selectedRoomId)
        .map(r => ({
            id: r.id.toString(),
            title: r.title,
            start: r.start_time,
            end: r.end_time,
            backgroundColor: '#2563eb',
            borderColor: '#1d4ed8',
        }));

    const handleDateSelect = (selectInfo: any) => {
        setSelectInfo(selectInfo);
        setData({
            room_id: String(selectedRoomId),
            title: '',
            start_time: selectInfo.startStr,
            end_time: selectInfo.endStr,
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('reservations.store'), {
            onSuccess: () => {
                setModalOpen(false);
                reset();
                selectInfo?.view.calendar.unselect();
            },
        });
    };

    const handleViewChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const view = e.target.value as any;
        setCurrentView(view);
        calendarRef.current?.getApi().changeView(view);
    };

    return (
        <>
            <Head title={`Kalender - ${initialRoom.name}`} />

            {/* HEADER - Simple & Clean */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo & Title */}
                        <div className="flex items-center space-x-3">
                            <CalendarIcon className="w-7 h-7 text-blue-600" />
                            <h1 className="text-lg font-semibold text-gray-900">Reservasi Ruang</h1>
                        </div>

                        {/* Right Menu */}
                        <div className="flex items-center space-x-3">
                          

                            {/* User Menu */}
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
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
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

            {/* Toast Notification */}
            <Transition show={showToast} as={Fragment}>
                <div className="fixed top-20 right-6 z-50">
                    <div className="bg-white border border-green-200 shadow-lg px-4 py-3 rounded-lg flex items-center gap-3 max-w-sm">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <div>
                            <p className="font-medium text-sm text-gray-900">Berhasil!</p>
                            <p className="text-xs text-gray-600">{flash?.success}</p>
                        </div>
                    </div>
                </div>
            </Transition>

            {/* Main Content */}
            <div className="min-h-screen bg-gray-50 py-6">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-white rounded-lg shadow">
                        {/* Header Section */}
                        <div className="border-b border-gray-200 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">{initialRoom.name}</h2>
                                    <p className="text-sm text-gray-600 mt-1">Pilih slot waktu untuk membuat reservasi</p>
                                </div>
                                <div>
                                    <select
                                        value={currentView}
                                        onChange={handleViewChange}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="dayGridMonth">Bulanan</option>
                                        <option value="timeGridWeek">Mingguan</option>
                                        <option value="timeGridDay">Harian</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Calendar */}
                        <div className="p-6">
                            <FullCalendar
                                ref={calendarRef}
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView="timeGridWeek"
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: ''
                                }}
                                locale="id"
                                slotMinTime="07:00:00"
                                slotMaxTime="21:00:00"
                                height="650px"
                                selectable={true}
                                selectOverlap={false}
                                eventOverlap={false}
                                select={handleDateSelect}
                                events={filteredEvents}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Transition show={modalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setModalOpen(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100">
                        <div className="fixed inset-0 bg-black bg-opacity-40" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100">
                                <Dialog.Panel className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Buat Reservasi</h3>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Meeting</label>
                                            <input
                                                type="text"
                                                value={data.title}
                                                onChange={e => setData('title', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Contoh: Rapat Tim Marketing"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Mulai</label>
                                                <input 
                                                    type="datetime-local" 
                                                    value={data.start_time.slice(0,16)} 
                                                    onChange={e => setData('start_time', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Selesai</label>
                                                <input 
                                                    type="datetime-local" 
                                                    value={data.end_time.slice(0,16)} 
                                                    onChange={e => setData('end_time', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {errors.start_time && (
                                            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                                                {errors.start_time}
                                            </div>
                                        )}

                                        <div className="flex gap-3 pt-2">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {processing ? 'Menyimpan...' : 'Simpan'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setModalOpen(false)}
                                                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium text-sm rounded-lg transition"
                                            >
                                                Batal
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}