import MUITextField from "@material-ui/core/TextField";

const TextField = (label, handleChange) => {
      return (
            <MUITextField
                  label={label}
                  variant="outlined"
                  onChange={handleChange}
                  fullWidth
            />
      );
}

export default TextField;
