import { useState, useEffect } from "react";
import { getTrackingParamsFromCookie } from "@/shared/lib";

/**
 * Возвращает UTM/gclid и др. параметры с рекламного захода (из cookie, которую выставляет middleware).
 * Обновляется после mount, чтобы не ломать гидрацию.
 */
export function useTrackingParams(): URLSearchParams {
  const [params, setParams] = useState<URLSearchParams>(() => new URLSearchParams());

  useEffect(() => {
    setParams(getTrackingParamsFromCookie());
  }, []);

  return params;
}
