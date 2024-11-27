import { CardWrapper } from './CardWrapper';

export const SuccessCard = () => {
  return (
    <CardWrapper>
      <div className="h-103 w-104 flex flex-col items-center justify-center gap-5">
        <img src="public/icons/success-pay.svg" alt="success" className="w-10" />
        <h5 className="text-title text-1000">Оплата прошла успешно</h5>
      </div>
    </CardWrapper>
  );
};
