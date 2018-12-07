module CustomHelpers
  def datetime_tag(datetime)
    content_tag :time, datetime: datetime.strftime("%FT%T"), pubdate: true, data: {updated: true} do |variable|
      datetime.strftime("%b #{datetime.day.ordinalize}, %Y")
    end
  end
end
