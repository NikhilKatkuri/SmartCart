'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { FixedSizeGrid as Grid, GridOnItemsRenderedProps } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import ProductCard from '@/components/productCard';
import { SkeletonCard } from '@/components/SkeletonCard';

interface Product {
      product_id: string;
      product_title: string;
      price: number;
      discount_percentage: number;
      rating: number;
      review_count: number;
      short_description: string;
      stock_quantity: number;
      category: string;
      currency: string;
      image_url?: string | null;
      Img_URL?: string | null;
}

interface VirtualProductGridProps {
      products: Array<Product | undefined>;
      totalCount: number;
      isItemLoaded: (index: number) => boolean;
      loadMoreItems: (startIndex: number, stopIndex: number) => Promise<void> | void;
}

export function VirtualProductGrid({
      products,
      totalCount,
      isItemLoaded,
      loadMoreItems,
}: VirtualProductGridProps) {
      const containerRef = useRef<HTMLDivElement>(null);
      const [containerWidth, setContainerWidth] = useState(1200);
      const [gridHeight, setGridHeight] = useState(1256);

      useEffect(() => {
            if (!containerRef.current) return;

            const observer = new ResizeObserver((entries) => {
                  const entry = entries[0];
                  if (entry) {
                        setContainerWidth(entry.contentRect.width);
                  }
            });

            observer.observe(containerRef.current);
            return () => observer.disconnect();
      }, []);

      useEffect(() => {
            const updateHeight = () => {
                  setGridHeight(Math.max(520, window.innerHeight - 220));
            };

            updateHeight();
            window.addEventListener('resize', updateHeight);
            return () => window.removeEventListener('resize', updateHeight);
      }, []);

      const { columnCount, columnWidth, rowHeight, gap, itemWidth } = useMemo(() => {
            const gap = 24;

            const columnCount =
                  containerWidth >= 1200 ? 4 :
                        containerWidth >= 900 ? 3 :
                              containerWidth >= 640 ? 2 : 1;

            const itemWidth = Math.floor((containerWidth - gap * (columnCount - 1)) / columnCount);

            return {
                  columnCount,
                  columnWidth: itemWidth + gap,
                  rowHeight: 560 + gap,
                  gap,
                  itemWidth,
            };
      }, [containerWidth]);

      const rowCount = Math.ceil(totalCount / columnCount);
      const gridWidth = columnCount * columnWidth - gap;

      return (
            <div ref={containerRef} className="w-full">
                  <InfiniteLoader
                        isItemLoaded={isItemLoaded}
                        itemCount={totalCount}
                        loadMoreItems={loadMoreItems}
                        
                  >
                        {({ onItemsRendered, ref }:{ onItemsRendered: (args: any) => void; ref: React.RefObject<any> }) => (
                              <Grid
                                    ref={ref}
                                    height={gridHeight}
                                    width={Math.min(containerWidth, gridWidth)}
                                    columnCount={columnCount}
                                    columnWidth={columnWidth}
                                    rowCount={rowCount}
                                    rowHeight={rowHeight}
                                    onItemsRendered={(gridData: GridOnItemsRenderedProps) => {
                                          const {
                                                visibleRowStartIndex,
                                                visibleRowStopIndex,
                                                overscanRowStartIndex,
                                                overscanRowStopIndex,
                                          } = gridData;

                                          onItemsRendered({
                                                overscanStartIndex: overscanRowStartIndex * columnCount,
                                                overscanStopIndex: Math.min(totalCount - 1, (overscanRowStopIndex + 1) * columnCount - 1),
                                                visibleStartIndex: visibleRowStartIndex * columnCount,
                                                visibleStopIndex: Math.min(totalCount - 1, (visibleRowStopIndex + 1) * columnCount - 1),
                                          });
                                    }}
                              >
                                    {({ columnIndex, rowIndex, style }: { columnIndex: number; rowIndex: number; style: React.CSSProperties }) => {
                                          const index = rowIndex * columnCount + columnIndex;

                                          if (index >= totalCount) {
                                                return null;
                                          }

                                          const item = products[index];

                                          return (
                                                <div
                                                      style={{
                                                            ...style,
                                                            paddingRight: columnIndex === columnCount - 1 ? 0 : gap,
                                                            paddingBottom: gap,
                                                            width: columnWidth,
                                                            height: rowHeight,
                                                            boxSizing: 'border-box',
                                                      }}
                                                >
                                                      <div style={{ width: itemWidth, height: rowHeight - gap }}>
                                                            {item ? <ProductCard data={item} /> : <SkeletonCard />}
                                                      </div>
                                                </div>
                                          );
                                    }}
                              </Grid>
                        )}
                  </InfiniteLoader>
            </div>
      );
}