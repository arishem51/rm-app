import ReceiptForm from "@/components/dashboard/receipts/receipt-form";
import { Separator } from "@/components/ui/separator";
import { OctagonAlert } from "lucide-react";
import { Fragment } from "react";

const warns = [
  `Bạn không thể tạo phiếu nhập khi chưa có sản phẩm/khu vực nào`,
  `Bạn không thể tạo phiếu nhập với nhiều sản phẩm có trùng khu vực`,
  `Bạn không thể tạo phiếu nhập với sản phẩm mà khu vực đó đã có sản phẩm khác `,
  `Bạn không thể tạo phiếu nhập với cùng sản phẩm ở cùng khu vực nhưng khác quy cách`,
  "Trường hợp sản phẩm với cùng quy cách thì sẽ cộng dồn số lượng",
];

const Page = () => {
  return (
    <div className="px-4">
      <h1 className="text-3xl font-bold mt-2">Phiếu nhập</h1>
      <p className="text-sm text-muted-foreground">
        Tạo phiếu nhập trong cửa hàng của bạn
      </p>
      <div className="flex gap-4">
        <div className="w-2/3">
          <Separator className="my-4" />
          <ReceiptForm />
        </div>
        <div className="w-1/3">
          <p className="flex items-center gap-1 mb-1">
            <OctagonAlert className="h-4 w-4" />
            Lưu ý khi tạo phiếu nhập
          </p>
          {warns.map((warn, index) => (
            <Fragment key={index}>
              {index !== 0 && <Separator className="my-2 w-2/3" />}
              <p className="text-sm text-muted-foreground">{warn}</p>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
