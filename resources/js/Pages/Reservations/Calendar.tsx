// resources/js/Pages/Reservations/Calendar.tsx
import { useState, useRef, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js'; // INI YANG PALING PENTING!

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronDownIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

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
    const [selectedRoomId, setSelectedRoomId] = useState<number>(initialRoom.id);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectInfo, setSelectInfo] = useState<any>(null);
    const [currentView, setCurrentView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>('timeGridWeek');
    const [showToast, setShowToast] = useState(!!flash?.success);

    const calendarRef = useRef<FullCalendar>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        room_id: String(initialRoom.id),
        title: '',
        start_time: '',
        end_time: '',
    });

    // Toast otomatis muncul & hilang
    useEffect(() => {
        if (flash?.success) {
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 5000);
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
            backgroundColor: '#6366f1',
            borderColor: '#4f46e5',
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

            {/* Toast Sukses */}
            <Transition show={showToast} as={Fragment}>
                <div className="fixed top-6 right-6 z-50 animate-bounce">
                    <div className="bg-green-600 text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4">
                        <CheckCircleIcon className="h-10 w-10" />
                        <div>
                            <p className="font-bold text-lg">Reservasi Berhasil!</p>
                            <p className="text-sm">{flash?.success}</p>
                        </div>
                    </div>
                </div>
            </Transition>

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="bg-liniear-to-r from-indigo-600 to-purple-700 px-8 py-10 text-white">
                            <h1 className="text-4xl font-bold">{initialRoom.name}</h1>
                            <p className="text-xl opacity-90 mt-2">Pilih waktu untuk meeting</p>
                        </div>

                        <div className="p-8 relative">
                            <div className="mb-8 flex justify-between items-center">
                                <div>
                                    <label className="block text-lg font-semibold text-gray-700 mb-2">Pilih Ruangan</label>
                                    <select
                                        value={selectedRoomId}
                                        onChange={(e) => setSelectedRoomId(Number(e.target.value))}
                                        className="px-6 py-3 border-2 border-indigo-200 rounded-xl text-lg font-medium focus:ring-4 focus:ring-indigo-300"
                                    >
                                        {rooms.map(room => (
                                            <option key={room.id} value={room.id}>{room.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="relative">
                                    <select
                                        value={currentView}
                                        onChange={handleViewChange}
                                        className="appearance-none bg-white border-2 border-gray-300 rounded-xl px-6 py-3 pr-12 text-lg font-medium shadow-md focus:ring-4 focus:ring-indigo-300 cursor-pointer"
                                    >
                                        <option value="dayGridMonth">Bulan</option>
                                        <option value="timeGridWeek">Minggu</option>
                                        <option value="timeGridDay">Hari</option>
                                    </select>
                                    <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500 pointer-events-none" />
                                </div>
                            </div>

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
                                height="700px"
                                selectable={true}
                                selectOverlap={false}
                                eventOverlap={false}
                                select={handleDateSelect}
                                events={filteredEvents}
                            />
                        </div>
                    </div>
                </div>

                {/* Modal Buat Reservasi */}
                <Transition show={modalOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-50" onClose={() => setModalOpen(false)}>
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100">
                            <div className="fixed inset-0 bg-black bg-opacity-50" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4">
                                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100">
                                    <Dialog.Panel className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8">
                                        <h3 className="text-3xl font-bold text-gray-800 mb-6">Buat Reservasi Baru</h3>

                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-6">
                                                <label className="block text-lg font-medium text-gray-700 mb-3">Judul Meeting</label>
                                                <input
                                                    type="text"
                                                    value={data.title}
                                                    onChange={e => setData('title', e.target.value)}
                                                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-600"
                                                    placeholder="Rapat Bulanan Tim Marketing"
                                                    required
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-6 mb-6">
                                               <div>
                                                <label className="block text-lg font-medium text-gray-700 mb-3">Mulai</label>
                                                <input 
                                                    type="datetime-local" 
                                                    value={data.start_time.slice(0,16)} 
                                                    onChange={e => setData('start_time', e.target.value)}
                                                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-lg focus:ring-4 focus:ring-indigo-300"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-lg font-medium text-gray-700 mb-3">Selesai</label>
                                                <input 
                                                    type="datetime-local" 
                                                    value={data.end_time.slice(0,16)} 
                                                    onChange={e => setData('end_time', e.target.value)}
                                                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-lg focus:ring-4 focus:ring-indigo-300"
                                                    required
                                                />
                                            </div>
                                            </div>

                                            {errors.start_time && (
                                                <div className="bg-red-50 border border-red-300 text-red-700 px-6 py-4 rounded-xl mb-6">
                                                    {errors.start_time}
                                                </div>
                                            )}

                                            <div className="flex gap-4">
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xl rounded-xl transition disabled:opacity-70"
                                                >
                                                    {processing ? 'Menyimpan...' : 'Buat Reservasi'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setModalOpen(false)}
                                                    className="px-10 py-5 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold text-xl rounded-xl transition"
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
            </div>
        </>
    );
}