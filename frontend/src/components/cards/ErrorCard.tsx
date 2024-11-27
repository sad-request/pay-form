import { CardWrapper } from './CardWrapper';

export const ErrorCard = () => {
  return (
    <CardWrapper>
      <div className="h-103 w-104 flex flex-col items-center justify-center gap-5">
        <img src="public/icons/error-pay.svg" alt="error" className="w-10" />
        <h5 className="text-title text-1000">Произошла ошибка</h5>
      </div>
    </CardWrapper>
  );
};
