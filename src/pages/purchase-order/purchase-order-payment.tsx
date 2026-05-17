import { Popup } from '@/components/popup'
import { SelectApp, SelectOption } from '@/components/select-app'
import { FieldLabel } from '@/components/ui/field'
import { LazyImage } from '@/components/ui/image'
import { useFetch } from '@/hooks/useFetch'
import { BankAccount } from '@/models/bank.model'
import { PurchaseOrder } from '@/models/purchase-order.model'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PurchaseOrderPaymentConfirm from './purchase-order-payment-confirm'
import { useNotificationStore } from '@/store/notification.store'

interface IPurchaseOrderPaymentProps {
    purchase: PurchaseOrder | undefined
    onClose: () => void
    handleConfirm: (value: string | null) => void
}

export default function PurchaseOrderPayment({ purchase, handleConfirm, onClose }: IPurchaseOrderPaymentProps) {
    const { t } = useTranslation();
    const notification = useNotificationStore();
    const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
    const [bank, setBank] = useState<BankAccount | null>(null);
    const [isConfirm, setIsConfirm] = useState<boolean>(false);

    const { data: bankOptions } = useFetch<
        BankAccount[],
        SelectOption[]
    >({
        url: "banks",
        key: ["banks"],
        options: {
            select: (banks) =>
                banks.map((bank) => ({
                    label: `${bank.bank_name} - ${bank.account_number} (${bank.owner_name})`,
                    value: bank.id.toString(),
                    default: bank.is_default === 1,
                    otherValue: bank
                })),
        },
    });

    const onChangeBank = (value: string) => {
        const bankOption = bankOptions?.find(b => b.value === value)

        if (bankOption) {
            setBank(bankOption.otherValue)
        }
    }

    const confirmPayment = () => {
        if (!paymentMethod) {
            notification.updateState({
                message: t("requirePaymentMethod"),
                open: true,
                type: "error",
            });
            return;
        }

        if (paymentMethod === "transfer" && !bank) {
            notification.updateState({
                message: t("requireBank"),
                open: true,
                type: "error",
            });
            return;
        }

        setIsConfirm(true)
    }

    const onPayment = () => {
        handleConfirm(paymentMethod)
    }

    const onChangePaymentMethod = (value: string) => {
        setPaymentMethod(value)
    }

    return (
        <Popup
            onConfirm={confirmPayment}
            variant="md"
            type="confirm"
            open
            onClose={onClose}
            title="payment"
        >
            <div>
                <div>
                    <FieldLabel>{t("paymentMethod")}</FieldLabel>

                    <div className="gap-4">
                        <div className="mt-2">
                            <SelectApp
                                placeholder="Chọn phương thức thanh toán"
                                options={[
                                    {
                                        label: "Tiền mặt",
                                        value: "money",
                                    },
                                    {
                                        label: "Chuyển khoản",
                                        value: "transfer",
                                    },
                                ]}
                                onValueChange={onChangePaymentMethod}
                                value={paymentMethod ?? ""}
                            />
                        </div>
                        {
                            paymentMethod === "transfer" && <div className="mt-2">
                                <SelectApp
                                    placeholder="Chọn tài khoản ngân hàng"
                                    options={bankOptions ?? []}
                                    onValueChange={onChangeBank}
                                    value={bank?.id.toString() ?? ""}
                                />
                            </div>
                        }
                    </div>
                    {
                        paymentMethod === "transfer" && bank &&
                        <div className="w-full mt-3">
                            <LazyImage
                                src={`https://img.vietqr.io/image/${bank.bank_code}-${bank.account_number}-compact.jpg?amount=${purchase?.total_price}&addInfo=${purchase?.purchase_order_code}`}
                                className="w-40 h-40 mx-auto"
                            />
                        </div>
                    }
                </div>
            </div>

            {
                isConfirm && <PurchaseOrderPaymentConfirm onConfirm={onPayment} onClose={() => setIsConfirm(false)} purchaseOrder={purchase} />
            }
        </Popup>
    )
}
