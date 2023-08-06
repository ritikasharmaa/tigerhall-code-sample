import { setAccessToken } from 'redux/ducks/user';
import { store } from 'redux/store';

export default function handleAPIErrors({ networkError }) {
  if (networkError && 'statusCode' in networkError) {
    switch (networkError.statusCode) {
      case 401: {
        store.dispatch(
          setAccessToken({
            token: null
          })
        );
        break;
      }
      case 400:
      case 404:
      case 405:
      case 407:
      case 408:
      case 422:
      case 429:
        // TODO: replace this implementation. We cannot use `useToast` here
        // because this is not a react component or react hook but a function.
        // ------------------------------------------------------------------
        // toast({
        //   duration: 3000,
        //   isClosable: true,
        //   position: 'top-right',
        //   render: ({ id, onClose }) =>
        //     CustomToast({
        //       message: networkError?.message || 'Some error occured',
        //       id,
        //       onClose,
        //       type: 'ERROR'
        //     })
        // });
        break;
      default:
        return null;
    }
  }
}
