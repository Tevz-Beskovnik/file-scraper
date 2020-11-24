# File scraper

### What is it used for?

* **Saving spool files:** spool files, are files created by Windows for later proccessing or printing, making the printing proccess less resource intensive?
* **Why would you need to save spool files:** The reason you would use this program, is to save a file if the program printing does not save it automaticaly or has a feature to save it.

### How do you use it?

After downloading it, place it to your desired location and open *"start.bat"*. When the program starts you will get two promts, first is the directory for the output files, if you press enter it defaults to */file-scraper/out* and the second is to input the printer *(a.k.a. the pdf printer you want the files to be printed to)*, if you press enter it will default to "Microsoft Print to PDF".

#### Other prompts

  * **devName nameOfFile**
    Ment strictly for **development purpouses** otherwise might cause problems with overriding the files. With this command you will set to what the name of the file output is, if     it is unset it will set the filename to the date and time of when the file was saved.
    
 * **debug**
    Turns on debug mode, at the start logs current working directory and where the documents folder is located, then starts logging every event in the program when it gets called     and writes it to *"debug.log"*.
    
 * **sDir pathToDirectory**
    Sets the spool direcotry to a new one, by default it uses the *"C:/Windows/System32/spool/PRINTERS"* directory where the .spl files are created by windows.
    
**Any of the above mentioned configurations can be reset or changed by restarting the program.**
