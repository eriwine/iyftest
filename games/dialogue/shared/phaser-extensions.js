Phaser.Text.prototype.autoSizeFont = function(width, height)
{	
	// So we don't lose the original value of the font size, create a property on the field to store it.	
	if (!('defaultFontSize' in this))	
	{		
		this['defaultFontSize'] = this.fontSize;	
	}	
	// Set the field's font size back to it's original value before setting the new text.	
	this.fontSize = this['defaultFontSize'];	
	// If word wrap is set, then use the word wrap width as the bounds' width instead.	
	if (this.wordWrap)	{  width = this.wordWrapWidth;	}	

	// Check if bounds were provided.	
	if (width > 0 && height > 0)	
	{			
		// Use the default font size as a base for the auto sizing.		
		var size = this['defaultFontSize'];		
		// While the width or height is greater then the provided bounds, subtract one from the font size.		
		while ((this.width > width || this.height > height) && this.fontSize > 4)		
		{			
			this.fontSize = --size;		
		}	
	}
}