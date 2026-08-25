import { redirect, RedirectType } from 'next/navigation'

export default function MenuRedirect() {
  redirect('/menu/categories', RedirectType.replace)
}
