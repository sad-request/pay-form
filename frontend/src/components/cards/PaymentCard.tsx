import { KeyboardEvent, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { payFormSchema } from '../../validation/payFormSchema';
import { API_PAY } from '../../constants';
import { InputWrapper } from '../inputs/InputWrapper';
import { v4 as uuidv4 } from 'uuid';
import { TPayRarams } from '../../types/payFormTypes';
import { useCheckPayment } from '../../hooks/useCheckPayment';
import clsx from 'clsx';
import { useNavigate } from 'react-router';
import { CardWrapper } from './CardWrapper';
import { NumberFormatBase, PatternFormat } from 'react-number-format';
import { isObjectEmpty } from '../../utils';

export const PaymentCard = () => {
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(true);
  const [isShowCVC, setIsShowCVC] = useState<boolean>(false);
  const [isSended, setIsSended] = useState<boolean>(false);
  const [pid, setPid] = useState<string>('');
  const { checkingStatus } = useCheckPayment({ isSended, pid });
  const navigate = useNavigate();
  const id = uuidv4();

  const methods = useForm<TPayRarams>({
    resolver: yupResolver(payFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    setValue,
    control,
  } = methods;

  const onSubmit = async (data: TPayRarams) => {
    let errorMessage;

    try {
      const payResponse = await fetch(API_PAY, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: id,
          method: 'pay',
          params: data,
        }),
      });
      const result = await payResponse?.json();

      if (payResponse.ok) {
        setPid(result.result.pid);
        setIsSended(true);
      } else {
        errorMessage = result.message || payResponse.statusText;
      }
    } catch (e) {
      errorMessage = (e as unknown as Error).message;
    }
    if (errorMessage) console.error(errorMessage);
  };

  const handleIgnorePrintedSlash = (e: KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const { value, selectionStart } = target;
    const isSlashInString = e.key === '/' && value[selectionStart || 0] === '/';

    if (isSlashInString) {
      if (value.split('/')[0].length === 1) {
        target.value = `0${value}`;
        target.selectionStart = (target.selectionStart as number) + 1;
      }

      target.selectionStart = (target.selectionStart as number) + 1;
      e.preventDefault();
    }
  };

  const formatExpireDate = (val: string) => {
    if (val === '') return '';
    let month = val.substring(0, 2);
    const year = val.substring(2, 4);

    if (month.length === 1 && Number(month[0]) > 1) {
      month = `0${month[0]}`;
    } else if (month.length === 2) {
      if (Number(month) === 0) {
        month = `01`;
      } else if (Number(month) > 12) {
        month = '12';
      }
    }

    return `${month}/${year}`;
  };

  useEffect(() => {
    switch (checkingStatus) {
      case 'fail':
        navigate('/payment-failed');
        break;
      case 'ok':
        navigate('/payment-success');
        break;
      default:
        return;
    }
  }, [checkingStatus]);

  useEffect(() => {
    setIsDisabledButton(isObjectEmpty(dirtyFields));
  }, [{...dirtyFields}]);

  return (
    <CardWrapper>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <h5 className="text-title text-grey-1000">Оплата банковской картой</h5>
        <InputWrapper
          inputName="pan"
          label="Номер карты"
          error={errors.pan}
          children={
            <Controller
              name="pan"
              control={control}
              render={(props) => (
                <PatternFormat
                  format="#### #### #### #### ###"
                  allowEmptyFormatting={false}
                  mask=" "
                  onBlur={props.field.onBlur}
                  onChange={(e) => {
                    props.field.onChange(e.target.value.split(' ').join(''));
                  }}
                  placeholder="0000 0000 0000 0000"
                  type="text"
                  className={clsx(
                    'w-full h-10 px-3 py-2 rounded-lg border focus:outline-none active:outline-none',
                    errors.pan ? 'border-error' : 'border-gray-200',
                  )}
                />
              )}
            />
          }
        />
        <div className="flex flex-row gap-16">
          <InputWrapper
            inputName="expire"
            label="Месяц/Год"
            error={errors.expire}
            children={
              <Controller
                name="expire"
                control={control}
                render={(props) => (
                  <NumberFormatBase
                    format={formatExpireDate}
                    onKeyDown={handleIgnorePrintedSlash}
                    onBlur={props.field.onBlur}
                    onChange={(e) => {
                      props.field.onChange(e.target.value);
                    }}
                    placeholder="Default"
                    type="text"
                    className={clsx(
                      'w-44 h-10 px-3 py-2 border rounded-lg focus:outline-none active:outline-none',
                      errors.expire ? 'border-error' : 'border-gray-200',
                    )}
                  />
                )}
              />
            }
          />
          <InputWrapper
            inputName="cvc"
            label="Код"
            error={errors.cvc}
            children={
              <div
                className={clsx(
                  'flex w-44 h-10 pr-2 border rounded-lg',
                  errors.cvc ? 'border-error' : 'border-gray-200',
                )}
              >
                <input
                  {...register('cvc')}
                  onChange={(e) => {
                    if (e.target.value.length <= 3) {
                      setValue('cvc', e.target.value, { shouldDirty: true });
                    } else {
                      setValue('cvc', e.target.value.slice(0, 3), { shouldDirty: true });
                    }
                    if (!e.target.value.match(/^[0-9]*$/)) {
                      setValue('cvc', e.target.value.slice(0, -1), { shouldDirty: true });
                    }
                  }}
                  placeholder="***"
                  type={isShowCVC ? 'text' : 'password'}
                  className="px-3 py-2 w-full bg-transparent focus:outline-none active:outline-none"
                />
                <img
                  src={isShowCVC ? 'public/icons/eye-off.svg' : 'public/icons/eye.svg'}
                  onClick={() => setIsShowCVC(!isShowCVC)}
                />
              </div>
            }
          />
        </div>
        <InputWrapper
          inputName="cardholder"
          label="Владелец карты"
          error={errors.cardholder}
          children={
            <input
              {...register('cardholder')}
              onChange={(e) => {
                setValue('cardholder', e.target.value.toUpperCase(), { shouldDirty: true });
              }}
              placeholder="IVAN IVANOV"
              type="text"
              className={clsx(
                'w-full h-10 px-3 py-2 rounded-lg border focus:outline-none active:outline-none',
                errors.cardholder ? 'border-error' : 'border-gray-200',
              )}
            />
          }
        />
        <button
          type="submit"
          disabled={isDisabledButton}
          className={clsx(
            'rounded-lg h-12 min-w-32 self-end flex items-center justify-center',
            isSended || isDisabledButton
              ? 'bg-grey-100 text-grey-400'
              : 'text-button bg-primary text-white',
          )}
        >
          {isSended ? (
            <img
              src="public/icons/progressbar.svg"
              alt="loading"
              className="animate-spin h-6 w-6"
            />
          ) : (
            <p>Оплатить</p>
          )}
        </button>
      </form>
    </CardWrapper>
  );
};
