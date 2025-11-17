import { FormEventHandler, useEffect } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";

interface Props {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => reset("password");
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <GuestLayout>
            <Head title="Masuk" />

            <div className="w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Selamat Datang Kembali
                    </h1>
                    <p className="mt-2 text-gray-500 text-sm">
                        Masuk ke akun Anda untuk melanjutkan
                    </p>
                </div>

                {status && (
                    <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                        {status}
                    </div>
                )}
                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            value={data.email}
                            className="mt-2 block w-full"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData("email", e.target.value)}
                            placeholder="you@example.com"
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>
                    <div>
                        <div className="flex justify-between">
                            <InputLabel htmlFor="password" value="Password" />
                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="text-sm text-indigo-600 hover:text-indigo-700"
                                >
                                    Lupa password?
                                </Link>
                            )}
                        </div>

                        <TextInput
                            id="password"
                            type="password"
                            value={data.password}
                            className="mt-2 block w-full"
                            autoComplete="current-password"
                            onChange={(e) => setData("password", e.target.value)}
                            placeholder="••••••••"
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>
                    <label className="flex items-center gap-3 text-sm text-gray-600">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData("remember", e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        Ingat saya
                    </label>
                    <PrimaryButton className="w-full justify-center py-2.5 text-base font-medium" disabled={processing}>
                        {processing ? "Memproses..." : "Masuk"}
                    </PrimaryButton>
                    <p className="text-center text-sm text-gray-600 pt-2">
                        Belum punya akun?{" "}
                        <Link
                            href={route("register")}
                            className="text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            Daftar
                        </Link>
                    </p>
                </form>
            </div>
        </GuestLayout>
    );
}
