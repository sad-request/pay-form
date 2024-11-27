import { ReactNode } from 'react';

type TCardWrapper = {
  children: ReactNode;
};
export const CardWrapper = ({ children }: TCardWrapper) => {
  return (
    <div className="shadow-lg rounded-lg border-solid border-gray-200 border p-5 pt-8 ">
      {children}
    </div>
  );
};
