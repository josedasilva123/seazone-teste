# Server Actions

Cada domínio tem sua própria subpasta. Exemplo: `lib/actions/booking/`.

## Convenções

- Todo arquivo exporta funções marcadas com `"use server"`.
- Server Actions são finas: validam entrada com Zod e delegam para o Service.
- Retornam um `ActionResult<T>` padronizado.
- Todos os request APIs são `async`: use `await cookies()`, `await headers()`.

## Estrutura de um Server Action

```ts
"use server";

import { bookingSchema } from "@/lib/validations/booking";
import { BookingService } from "@/lib/services/booking";
import type { ActionResult } from "@/lib/actions/types";

export async function createBooking(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const parsed = bookingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten() };
  }
  const booking = await BookingService.create(parsed.data);
  return { ok: true, data: { id: booking.id } };
}
```
