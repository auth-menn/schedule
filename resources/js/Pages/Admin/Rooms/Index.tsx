import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    XMarkIcon,
    PhotoIcon,
} from '@heroicons/react/24/outline';

type Room = {
    id: number;
    name: string;
    capacity: number;
    location: string | null;
    facilities: string | null;
    photo: string | null;
};

export default function RoomsIndex({ auth, rooms: initialRooms }: { auth: any; rooms: Room[] }) {
    const { flash } = usePage().props as any;

    const [rooms, setRooms] = useState<Room[]>(initialRooms);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [form, setForm] = useState({
        name: '',
        capacity: '',
        location: '',
        facilities: '',
        photo: null as File | null,
    });

    const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
    const openModal = (room?: Room) => {
        if (room) {
            setEditingRoom(room);
            setForm({
                name: room.name,
                capacity: room.capacity.toString(),
                location: room.location || '',
                facilities: room.facilities || '',
                photo: null,
            });
            setPreviewPhoto(room.photo ? `/storage/${room.photo}` : null);
        } else {
            setEditingRoom(null);
            setForm({ name: '', capacity: '', location: '', facilities: '', photo: null });
            setPreviewPhoto(null);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingRoom(null);
        setPreviewPhoto(null);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setForm({ ...form, photo: file });
            setPreviewPhoto(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('capacity', form.capacity);
        formData.append('location', form.location);
        formData.append('facilities', form.facilities);
        if (form.photo) formData.append('photo', form.photo);

        if (editingRoom) {
            formData.append('_method', 'PUT');
            router.post(route('admin.rooms.update', editingRoom.id), formData, {
                forceFormData: true,
                onSuccess: () => {
                    closeModal();
                    router.reload({ only: ['rooms'] });
                },
            });
        } else {
            router.post(route('admin.rooms.store'), formData, {
                forceFormData: true,
                onSuccess: () => {
                    closeModal();
                    router.reload({ only: ['rooms'] });
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus ruangan ini?')) {
            router.delete(route('admin.rooms.destroy', id), {
                onSuccess: () => router.reload({ only: ['rooms'] }),
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Ruangan" />
            {flash?.success && (
                <div className="mb-6 max-w-7xl mx-auto px-6">
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {flash.success}
                    </div>
                </div>
            )}

            <div className="py-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Manajemen Ruangan</h1>
                            <p className="text-sm text-gray-600 mt-1">Kelola semua ruangan meeting</p>
                        </div>
                        <button
                            onClick={() => openModal()}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Tambah Ruangan
                        </button>
                    </div>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Foto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Nama</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Kapasitas</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Lokasi</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {rooms.map((room) => (
                                    <tr key={room.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            {room.photo ? (
                                                <img src={`/storage/${room.photo}`} alt={room.name} className="w-16 h-16 object-cover rounded-lg" />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-200 border-2 border-dashed rounded-lg flex items-center justify-center">
                                                    <PhotoIcon className="w-8 h-8 text-gray-400" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{room.name}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{room.capacity} orang</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{room.location || '-'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openModal(room)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                >
                                                    <PencilIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(room.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-40" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {editingRoom ? 'Edit Ruangan' : 'Tambah Ruangan Baru'}
                                        </h2>
                                        <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                            <XMarkIcon className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Ruangan</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={form.name}
                                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Kapasitas</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    required
                                                    value={form.capacity}
                                                    onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
                                            <input
                                                type="text"
                                                value={form.location}
                                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Fasilitas (pisahkan dengan koma)</label>
                                            <textarea
                                                rows={3}
                                                value={form.facilities}
                                                onChange={(e) => setForm({ ...form, facilities: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                placeholder="Proyektor, AC, WiFi, dll"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Foto Ruangan</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                            {previewPhoto && (
                                                <div className="mt-4">
                                                    <img src={previewPhoto} alt="Preview" className="w-48 h-48 object-cover rounded-lg shadow-md" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-end gap-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={closeModal}
                                                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                            >
                                                {editingRoom ? 'Simpan Perubahan' : 'Tambah Ruangan'}
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </AuthenticatedLayout>
    );
}