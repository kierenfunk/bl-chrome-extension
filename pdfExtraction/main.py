import PyPDF2
 
pdffileobj=open('commission-guide.pdf','rb')
#create reader variable that will read the pdffileobj
pdfreader=PyPDF2.PdfFileReader(pdffileobj)
 
#This will store the number of pages of this pdf file
#x=pdfreader.numPages
 
#create a variable that will select the selected number of pages
pageobj=pdfreader.getPage(0)
 
#(x+1) because python indentation starts with 0.
#create text variable which will store all text datafrom pdf file
text=pageobj.extractText()
text=repr(text.strip('\n'))
print(text)