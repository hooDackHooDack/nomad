import { ActivityFormInput } from "@/types/activity/activity";

export const useFormValidation = (formValues: ActivityFormInput) => {
  const validateBasicStep = () => {
    const { title, category, description } = formValues;
    return Boolean(title?.trim() && category?.trim() && description?.trim());
  };

  const validateLocationStep = () => {
    return Boolean(formValues.address?.trim());
  };

  const validateScheduleStep = () => {
    return formValues.schedules?.some(
      (schedule) => schedule.date && schedule.startTime && schedule.endTime,
    );
  };

  const validateImageStep = () => {
    return Boolean(
      formValues.bannerImageUrl && formValues.subImageUrls?.length >= 1,
    );
  };

  const isFormValid = () => {
    return (
      validateBasicStep() &&
      validateLocationStep() &&
      validateScheduleStep() &&
      validateImageStep()
    );
  };

  return {
    validateBasicStep,
    validateLocationStep,
    validateScheduleStep,
    validateImageStep,
    isFormValid
  };
};