# FridaMultipleProcess
- Some app define multiprocess
```
<service
  android:name=".newActivity"
  android:process=":app">
</service>
```
- So this use frida spawn-gating feature to capture spawn event and attach to that spawned process
- My simple version is in hook.py
- Thanks to: https://gist.github.com/oleavr/ae7bcbbb9179852a4731
