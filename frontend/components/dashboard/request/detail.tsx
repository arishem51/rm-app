import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Image from "next/image";
import defaultPic from "../../../public/images/default-product.png";
import { format, formatDistanceToNow, subDays } from "date-fns";
import { vi } from "date-fns/locale";
export const ProductDetailModal = ({ product, isOpen, onClose }) => {
    if (!product) return null;
    const formatDate = (dateString: string) => {
            const date = new Date(dateString);
            const now = new Date();
    
            // Nếu thời gian dưới 24 giờ thì hiển thị "X giờ trước"
            if (date > subDays(now, 1)) {
                return formatDistanceToNow(date, { addSuffix: true, locale: vi });
            }
    
            // Nếu xa hơn 1 ngày, hiển thị theo định dạng ngày/tháng/năm
            return format(date, "dd/MM/yyyy HH:mm:ss");
        };
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Chi tiết sản phẩm</DialogTitle>
                    <DialogDescription>
                        Thông tin chi tiết về sản phẩm "{product.productName}".
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                <Image
                                        src={defaultPic}
                                        alt={product.productName ?? ""}
                                        width={50}
                                        height={50}
                                    />
                    <p><strong>Mô tả:</strong> {product.description}</p>
                    <p><strong>Danh mục:</strong> {product.categoryName || "Không có"}</p>
                    <p><strong>Nhà cung cấp:</strong> {product.supplierName || "Không có"}</p>
                    <p><strong>Ngày tạo:</strong> {formatDate(product.createdAt)}</p>
                    <p><strong>Nhân viên tạo:</strong> {product.createBy}</p>
                </div>
            </DialogContent>
        </Dialog>
    );
};
