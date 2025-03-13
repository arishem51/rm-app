import { Button } from "@/components/ui/button";
import {
  SquareArrowUpRight,
  Box,
  Clock,
  BarChart2,
  Monitor,
} from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen p-6 space-y-12">
      <section className="w-full max-w-4xl text-center mt-20">
        <h1 className="text-5xl font-extrabold">Ứng dụng Quản Lý Gạo</h1>
        <p className="mt-4 text-xl">
          Mang đến giải pháp quản lý hiệu quả cho các cửa hàng bán gạo
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/dashboard" className="flex items-center">
              Bắt đầu ngay
              <SquareArrowUpRight />
            </Link>
          </Button>
        </div>
      </section>

      <section className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-4">Về Dự Án</h2>
        <p className="text-lg text-center">
          Ứng dụng Quản Lý Gạo là dự án học thuật được phát triển bởi nhóm sinh
          viên của <strong>FPT University Hà Nội</strong> trong khuôn khổ môn
          SWP. Dự án được xây dựng nhằm cung cấp một hệ thống nhập hàng và theo
          dõi giao dịch cho các cửa hàng bán gạo, giúp tối ưu hóa quy trình vận
          hành và nâng cao hiệu quả kinh doanh.
        </p>
      </section>

      <section className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-4">Tính Năng Nổi Bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-4">
            <Box className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-xl font-semibold">Quản Lý Tồn Kho</h3>
              <p className="text-base text-gray-400">
                Cập nhật và theo dõi tồn kho chính xác và toàn diện.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Clock className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-xl font-semibold">Lịch Sử Giao Dịch</h3>
              <p className="text-base text-gray-400">
                Theo dõi chi tiết lịch sử nhập hàng và giao dịch.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <BarChart2 className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-xl font-semibold">Báo Cáo & Thống Kê</h3>
              <p className="text-base text-gray-400">
                Phân tích dữ liệu kinh doanh thông qua báo cáo chi tiết.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Monitor className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-xl font-semibold">Giao Diện Thân Thiện</h3>
              <p className="text-base text-gray-400">
                Dễ sử dụng và tương thích trên nhiều thiết bị.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-4">
          Lợi Ích Khi Sử Dụng Ứng Dụng
        </h2>
        <p className="text-lg text-center">
          Mặc dù là một dự án học thuật, Ứng dụng Quản Lý Gạo được phát triển
          với tâm huyết của các sinh viên FPT, nhằm mang đến một giải pháp thực
          tiễn giúp các cửa hàng và đại lý bán gạo quản lý hàng hóa một cách
          hiệu quả, tiết kiệm thời gian và tối ưu hóa nguồn lực.
        </p>
      </section>

      <section className="w-full max-w-4xl text-center">
        <Button asChild>
          <Link href="/dashboard" className="flex items-center">
            Khám phá Dashboard
            <SquareArrowUpRight />
          </Link>
        </Button>
      </section>

      <section className="w-full max-w-4xl text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Ứng dụng Quản Lý Gạo - Được phát triển
          bởi Nhóm 4 - SWP391 - SE1889-VJ - KhangPQ3 , FPT University Hà Nội |
          Dự án SWP
        </p>
      </section>
    </main>
  );
}
