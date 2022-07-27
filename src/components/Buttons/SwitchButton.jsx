import { FormControl, FormLabel, Switch } from "@chakra-ui/react";

export const SwitchButton = ({
  id,
  formControl: {
    trigger,
    formState: { errors },
    register,
    setValue,
  },
  label,
  colorScheme = "brand1",
  size,
  role,
  ...props
}) => {
  return (
    <FormControl
      id={id}
      isInvalid={errors[id]}
      display="flex"
      alignItems="center"
      role={role}
    >
      {label && (
        <FormLabel mb="0" fontSize={size} role={role}>
          {label}
        </FormLabel>
      )}
      <Switch
        colorScheme={colorScheme}
        role={role}
        {...register(id)}
        {...props}
        onClick={() => trigger(id)}
        size={size}
      />
    </FormControl>
  );
};
