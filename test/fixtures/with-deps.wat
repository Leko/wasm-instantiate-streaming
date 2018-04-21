(module
  (func $i (import "imports" "imported_func") (param i32))
  (func $exported_func (param $n i32)
    get_local $n
    call $i)
  (export "exported_func" (func $exported_func))
)
