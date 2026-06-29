import type { AnyFieldMeta } from '@tanstack/react-form';
import { Typography, type TypographyParagraphProps } from 'heroui-native/text';
import { Activity } from 'react';

type FieldErrorProps = {
  meta: AnyFieldMeta;
} & TypographyParagraphProps;

export const FieldError = ({ meta, ...props }: FieldErrorProps) => {
  return meta.errors.map(({ message }: { message: string }, index) => (
    <Activity key={index} mode={meta.isTouched ? 'visible' : 'hidden'}>
      <Typography.Paragraph className="text-red-500" {...props}>
        {message}
      </Typography.Paragraph>
    </Activity>
  ));
};
