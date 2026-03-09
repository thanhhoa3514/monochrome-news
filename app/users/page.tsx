import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'User List | Teacher Demo',
    description: 'A simple page to display users for the backend API demo',
};

// Mặc định Next.js App Router các file page.tsx sẽ là Server Component
export default async function UsersDemoPage() {
    let users = [];
    let error = null;

    try {
        // Gọi trực tiếp đến /users (không dùng /api theo như cấu hình rút gọn lúc nãy)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
            ? process.env.NEXT_PUBLIC_API_URL.replace('/api/v1', '')
            : 'https://backend-php-news-app.onrender.com';

        const endpoint = `${apiUrl}/users`;

        // Yêu cầu Fetch không lưu cache, luôn lấy dữ liệu mới nhất (SSR)
        const res = await fetch(endpoint, { cache: 'no-store' });

        if (!res.ok) {
            throw new Error(`Failed to fetch data: ${res.status}`);
        }

        const data = await res.json();

        // Backend Laravel paginate/Resource format thường bọc trong `data` key
        // Tuy nhiên nếu API thô trả về array thì ta gán luôn
        users = Array.isArray(data) ? data : (data.data || []);

    } catch (e) {
        console.error("Lỗi khi tải danh sách User:", e);
        error = e instanceof Error ? e.message : "Đã có lỗi xảy ra";
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-xl shadow border border-gray-100 p-8">

                    <div className="border-b pb-5 mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Danh sách Người Dùng (Users)</h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Đây là trang Demo gọi API hiển thị dữ liệu phục vụ báo cáo.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">Lỗi: {error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!error && users.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500 text-lg">Chưa có người dùng nào hoặc Backend đang ngủ...</p>
                        </div>
                    ) : (
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-24">
                                            ID
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Tên Người Dùng (Name)
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Email
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {users.map((user: any) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                #{user.id}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-semibold">
                                                {user.name}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {user.email || 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
