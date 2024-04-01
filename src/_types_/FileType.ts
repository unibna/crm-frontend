import { MouseEventHandler, ReactNode } from 'react';
import { DropzoneOptions } from 'react-dropzone';
// @mui
import { SxProps } from '@mui/material';
import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface CustomFile extends File {
  id?: string;
  path?: string;
  preview?: string;
  url?: string;
}

export interface UploadProps extends DropzoneOptions {
  error?: boolean;
  file: CustomFile | string | null;
  helperText?: ReactNode;
  sx?: SxProps<Theme>;
  isLoading?: boolean;
}

export interface UploadMultiFileProps extends DropzoneOptions {
  error?: boolean;
  isLoadingBackground?: boolean;
  isMultiple?: boolean;
  files: (File | string)[];
  showPreview: boolean;
  onRemove: (file: File | string | { id: string, url: string }) => void;
  onRemoveAll: VoidFunction;
  sx?: SxProps<Theme>;
  helperText?: ReactNode;
  onClickUpload?: MouseEventHandler<HTMLElement> | undefined
}
