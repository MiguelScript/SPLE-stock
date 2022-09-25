import Button from '@material-ui/core/Button';

const Button = ({ text, action, variant, color }) => {
      return (
            <Button
                  variant={variant}
                  color="secondary"
                  onClick={action}
            >
                  {text}
            </Button>
      );
}

export default Button;