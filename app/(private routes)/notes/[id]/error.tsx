'use client';

type Props = {
  error: Error;
  reset: () => void;
};

const Error = ({ error }: Props) => {
  return <p>Could not fetch note details. {error.message}</p>;
};

export default Error;
