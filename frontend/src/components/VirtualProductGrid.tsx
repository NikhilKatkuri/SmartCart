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
      const [gridHeight, setGridHeight] = useState(720);

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

      const { columnCount, columnWidth, rowHeight } = useMemo(() => {
            const columns = containerWidth > 1200 ? 4 : containerWidth > 900 ? 3 : containerWidth > 640 ? 2 : 1;
            const gap = 24;
            // Calculate width accurately to avoid horizontal overflow
            const width = Math.floor((containerWidth - (gap * (columns - 1))) / columns);

            return {
                  columnCount: columns,
                  columnWidth: width + (gap / columns), // Distribute gap
                  rowHeight: 540, // Increased slightly to prevent card cutoff
            };
      }, [containerWidth]);

      const rowCount = Math.ceil(totalCount / columnCount);

      return (
            <div ref={containerRef} className="w-full">
                  <InfiniteLoader
                        isItemLoaded={isItemLoaded}
                        itemCount={totalCount}
                        loadMoreItems={loadMoreItems}
                  >
                        {({ onItemsRendered, ref }) => (
                              <Grid
                                    ref={ref}
                                    height={gridHeight}
                                    width={containerWidth}
                                    columnCount={columnCount}
                                    columnWidth={columnWidth}
                                    rowCount={rowCount}
                                    rowHeight={rowHeight}
                                    onItemsRendered={(gridData: GridOnItemsRenderedProps) => {
                                          // Properly map Grid rows/columns to flat list indices for InfiniteLoader
                                          const {
                                                visibleRowStartIndex,
                                                visibleRowStopIndex,
                                                overscanRowStartIndex,
                                                overscanRowStopIndex
                                          } = gridData;

                                          onItemsRendered({
                                                overscanStartIndex: overscanRowStartIndex * columnCount,
                                                overscanStopIndex: (overscanRowStopIndex + 1) * columnCount - 1,
                                                visibleStartIndex: visibleRowStartIndex * columnCount,
                                                visibleStopIndex: (visibleRowStopIndex + 1) * columnCount - 1,
                                          });
                                    }}
                              >
                                    {({ columnIndex, rowIndex, style }) => {
                                          const index = rowIndex * columnCount + columnIndex;

                                          // Prevent rendering empty cells at the end of the last row
                                          if (index >= totalCount) {
                                                return <div style={style} />;
                                          }

                                          const item = products[index];

                                          return (
                                                <div style={{ ...style, padding: 12 }}>
                                                      {item ? (
                                                            <ProductCard data={item} />
                                                      ) : (
                                                            <SkeletonCard />
                                                      )}
                                                </div>
                                          );
                                    }}
                              </Grid>
                        )}
                  </InfiniteLoader>
            </div>
      );
}